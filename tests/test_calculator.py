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
