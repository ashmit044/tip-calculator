"""Tip & Bill Splitter Calculation Engine.

Provides simple Python functions to calculate tip amounts, total bills with tax,
and individual cost splits per person.
"""

from typing import Dict, Any

def calculate_tip_and_split(
    bill_amount: float,
    tip_percentage: float = 15.0,
    tax_percentage: float = 0.0,
    num_people: int = 1
) -> Dict[str, Any]:
    """Calculate total bill, tip amount, tax amount, and split per person."""
    if bill_amount < 0:
        raise ValueError("Bill amount cannot be negative.")
    if tip_percentage < 0:
        raise ValueError("Tip percentage cannot be negative.")
    if tax_percentage < 0:
        raise ValueError("Tax percentage cannot be negative.")
    if num_people <= 0:
        raise ValueError("Number of people must be at least 1.")

    # Compute individual monetary components
    tax_amount = bill_amount * (tax_percentage / 100.0)
    subtotal = bill_amount + tax_amount
    tip_amount = subtotal * (tip_percentage / 100.0)
    total_bill = subtotal + tip_amount

    # Individual split calculations
    per_person_total = total_bill / num_people
    per_person_tip = tip_amount / num_people
    per_person_subtotal = subtotal / num_people

    return {
        "original_bill": round(bill_amount, 2),
        "tax_percentage": tax_percentage,
        "tax_amount": round(tax_amount, 2),
        "subtotal": round(subtotal, 2),
        "tip_percentage": tip_percentage,
        "tip_amount": round(tip_amount, 2),
        "total_bill": round(total_bill, 2),
        "num_people": num_people,
        "per_person_total": round(per_person_total, 2),
        "per_person_tip": round(per_person_tip, 2),
        "per_person_subtotal": round(per_person_subtotal, 2),
    }
