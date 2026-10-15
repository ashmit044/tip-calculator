"""Tip & Bill Splitter Calculation Engine.

Provides simple Python functions to calculate tip amounts, total bills with tax,
and individual cost splits per person.
"""

from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from typing import Any, Dict


_CENT = Decimal("0.01")


def _as_money(value: float, field_name: str) -> Decimal:
    """Convert a user-supplied amount into a two-decimal-place currency value."""
    try:
        amount = Decimal(str(value))
    except (InvalidOperation, ValueError, TypeError) as error:
        raise ValueError(f"{field_name} must be a valid number.") from error

    if not amount.is_finite():
        raise ValueError(f"{field_name} must be a finite number.")
    return amount.quantize(_CENT, rounding=ROUND_HALF_UP)

def calculate_tip_and_split(
    bill_amount: float,
    tip_percentage: float = 15.0,
    tax_percentage: float = 0.0,
    num_people: int = 1
) -> Dict[str, Any]:
    """Calculate total bill, tip amount, tax amount, and split per person."""
    bill = _as_money(bill_amount, "Bill amount")
    tip_rate = _as_money(tip_percentage, "Tip percentage")
    tax_rate = _as_money(tax_percentage, "Tax percentage")

    if bill < 0:
        raise ValueError("Bill amount cannot be negative.")
    if tip_rate < 0:
        raise ValueError("Tip percentage cannot be negative.")
    if tax_rate < 0:
        raise ValueError("Tax percentage cannot be negative.")
    if num_people <= 0:
        raise ValueError("Number of people must be at least 1.")

    # Compute individual monetary components
    tax_amount = (bill * tax_rate / 100).quantize(_CENT, rounding=ROUND_HALF_UP)
    subtotal = bill + tax_amount
    tip_amount = (subtotal * tip_rate / 100).quantize(_CENT, rounding=ROUND_HALF_UP)
    total_bill = subtotal + tip_amount

    # Individual split calculations
    per_person_total = (total_bill / num_people).quantize(_CENT, rounding=ROUND_HALF_UP)
    per_person_tip = (tip_amount / num_people).quantize(_CENT, rounding=ROUND_HALF_UP)
    per_person_subtotal = (subtotal / num_people).quantize(_CENT, rounding=ROUND_HALF_UP)
    total_cents = int(total_bill * 100)
    base_share, extra_cent_shares = divmod(total_cents, num_people)
    per_person_shares = [
        float(Decimal(base_share + (index < extra_cent_shares)) / 100)
        for index in range(num_people)
    ]

    return {
        "original_bill": float(bill),
        "tax_percentage": float(tax_rate),
        "tax_amount": float(tax_amount),
        "subtotal": float(subtotal),
        "tip_percentage": float(tip_rate),
        "tip_amount": float(tip_amount),
        "total_bill": float(total_bill),
        "num_people": num_people,
        "per_person_total": float(per_person_total),
        "per_person_tip": float(per_person_tip),
        "per_person_subtotal": float(per_person_subtotal),
        "per_person_shares": per_person_shares,
    }
