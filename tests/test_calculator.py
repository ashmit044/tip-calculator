"""Unit tests for Tip & Bill Splitter."""

import pytest
from calculator import calculate_tip_and_split


def test_standard_tip_calculation():
    res = calculate_tip_and_split(bill_amount=100.0, tip_percentage=15.0, tax_percentage=0.0, num_people=2)
    assert res["original_bill"] == 100.0
    assert res["tip_amount"] == 15.0
    assert res["total_bill"] == 115.0
    assert res["per_person_total"] == 57.50


def test_tax_and_tip_calculation():
    # Bill = $100, Tax = 10% -> Subtotal = $110. Tip 10% on subtotal -> $11. Total = $121.
    res = calculate_tip_and_split(bill_amount=100.0, tip_percentage=10.0, tax_percentage=10.0, num_people=1)
    assert res["tax_amount"] == 10.0
    assert res["subtotal"] == 110.0
    assert res["tip_amount"] == 11.0
    assert res["total_bill"] == 121.0


def test_invalid_input_exceptions():
    with pytest.raises(ValueError):
        calculate_tip_and_split(bill_amount=-50.0)

    with pytest.raises(ValueError):
        calculate_tip_and_split(bill_amount=100.0, num_people=0)


def test_currency_values_are_rounded_before_split():
    result = calculate_tip_and_split(10.005, tip_percentage=10, num_people=3)

    assert result["original_bill"] == 10.01
    assert result["tip_amount"] == 1.0
    assert result["total_bill"] == 11.01
    assert result["per_person_total"] == 3.67


def test_individual_shares_reconcile_to_total_when_split_has_remainder():
    result = calculate_tip_and_split(10.00, tip_percentage=0, num_people=3)

    assert result["per_person_total"] == 3.33
    assert result["per_person_shares"] == [3.34, 3.33, 3.33]
    assert round(sum(result["per_person_shares"]), 2) == result["total_bill"]


def test_rejects_non_finite_currency_values():
    with pytest.raises(ValueError, match="finite"):
        calculate_tip_and_split(float("nan"))


@pytest.mark.parametrize("num_people", [2.5, True, "3"])
def test_rejects_non_integer_headcounts(num_people):
    with pytest.raises(ValueError, match="positive whole number"):
        calculate_tip_and_split(30, num_people=num_people)
