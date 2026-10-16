"""Streamlit Web Dashboard & CLI for Tip & Bill Splitter."""

import sys
import argparse
import streamlit as st
from calculator import calculate_tip_and_split


def run_cli():
    """CLI mode for calculating tip and split."""
    parser = argparse.ArgumentParser(description="Calculate tip and split bill among friends.")
    parser.add_argument("--bill", type=float, help="Original bill amount (e.g. 120.50)")
    parser.add_argument("--tip", type=float, default=15.0, help="Tip percentage (e.g. 15)")
    parser.add_argument("--tax", type=float, default=5.0, help="Tax percentage (e.g. 5)")
    parser.add_argument("--people", type=int, default=1, help="Number of people sharing bill")

    args = parser.parse_args()

    if args.bill is not None:
        bill_amount, tip_pct, tax_pct, people = args.bill, args.tip, args.tax, args.people
    else:
        print("--- 💵 Tip & Bill Splitter Calculator CLI ---")
        bill_amount = float(input("Enter bill amount ($): "))
        tip_pct = float(input("Enter tip percentage (%): ") or "15")
        tax_pct = float(input("Enter tax percentage (%): ") or "0")
        people = int(input("Enter number of people splitting: ") or "1")

    try:
        res = calculate_tip_and_split(bill_amount, tip_pct, tax_pct, people)
        print("\n--- Summary Breakdown ---")
        print(f"Original Bill: ${res['original_bill']:.2f}")
        print(f"Tax ({res['tax_percentage']}%): ${res['tax_amount']:.2f}")
        print(f"Tip ({res['tip_percentage']}%): ${res['tip_amount']:.2f}")
        print(f"Total Bill: ${res['total_bill']:.2f}")
        print(f"\n👉 Per Person ({res['num_people']} people): ${res['per_person_total']:.2f}")
        print("Individual shares (adjusted to sum exactly):")
        for index, share in enumerate(res["per_person_shares"], start=1):
            print(f"  Person {index}: ${share:.2f}")
    except ValueError as err:
        print(f"Error: {err}")


def run_streamlit():
    """Streamlit Web Dashboard interface."""
    st.set_page_config(page_title="Smart Tip & Bill Splitter", page_icon="💵", layout="centered")

    st.title("💵 Smart Tip & Bill Splitter")
    st.write("A beginner-friendly Python web app built with **Streamlit** to easily calculate restaurant tips, taxes, and split bills among friends.")

    st.markdown("---")
    st.subheader("⚙️ Bill Details")

    col1, col2 = st.columns(2)
    with col1:
        bill_amount = st.number_input("Bill Subtotal ($):", min_value=0.0, value=75.0, step=5.0, format="%.2f")
        tip_pct = st.slider("Tip Percentage (%):", 0.0, 30.0, 15.0, 1.0)
    with col2:
        tax_pct = st.number_input("Tax Percentage (%):", min_value=0.0, value=5.0, step=0.5, format="%.1f")
        people = st.number_input("Number of People:", min_value=1, value=3, step=1)

    if st.button("Calculate Split", type="primary") or bill_amount > 0:
        res = calculate_tip_and_split(bill_amount, tip_pct, tax_pct, people)

        st.markdown("### 📊 Payment Summary")

        m1, m2, m3 = st.columns(3)
        m1.metric("Total Bill", f"${res['total_bill']:.2f}")
        m2.metric("Total Tip", f"${res['tip_amount']:.2f}")
        m3.metric("Average Share", f"${res['per_person_total']:.2f}")

        st.markdown("---")
        st.subheader("📋 Itemized Breakdown")
        st.write(f"• **Original Subtotal:** ${res['original_bill']:.2f}")
        st.write(f"• **Tax ({res['tax_percentage']}%):** ${res['tax_amount']:.2f}")
        st.write(f"• **Tip ({res['tip_percentage']}%):** ${res['tip_amount']:.2f}")
        st.write(f"• **Average per person ({res['num_people']} people):** ${res['per_person_total']:.2f}")
        st.caption("Individual shares may differ by one cent to make the split add up exactly.")
        st.write("**Individual shares:** " + ", ".join(f"${share:.2f}" for share in res["per_person_shares"]))


if __name__ == "__main__":
    if "streamlit" in sys.modules or (len(sys.argv) > 1 and sys.argv[1].endswith(".py")):
        run_streamlit()
    else:
        run_cli()
