# 💵 Tip & Bill Splitter Calculator

<p align="left">
  <img src="https://img.shields.io/badge/Python-3.10%2B-blue?style=flat-square&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Streamlit-1.25.0-FF4B4B?style=flat-square&logo=streamlit&logoColor=white" alt="Streamlit" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

A clean, beginner-friendly Python web app and CLI tool that calculates restaurant tips, sales tax, total bills, and individual payment splits per person.

I built this project to practice writing modular Python functions, handling floating-point arithmetic rounding, and creating interactive web applications with Streamlit.

---

## ✨ Features

- 💰 **Custom Tip & Tax Calculations**: Adjust tip percentages and sales tax to calculate exact totals.
- 👥 **Bill Splitting**: Automatically divides the subtotal, tax, and tip equally among any number of people.
- 🌐 **Streamlit Web UI**: Simple, clean web interface with real-time metric cards.
- 💻 **CLI Mode**: Interactive terminal prompt and command-line argument support.
- 🧪 **Unit Tests**: Covered with `pytest` unit tests for calculation edge cases.

---

## 🚀 Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/ashmit044/tip-calculator.git
cd tip-calculator
```

### 2. Create Virtual Environment & Install Dependencies
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

---

## 🏃 How to Run

### 1. Launch Streamlit Web App
```bash
streamlit run app.py
```

### 2. Run CLI Mode
Interactive prompt:
```bash
python app.py
```

Command-line parameters:
```bash
python app.py --bill 120.50 --tip 15 --tax 5 --people 4
```

### 3. Run Unit Tests
```bash
pytest
```

---

## 🛠️ Project Structure

```text
tip-calculator/
├── calculator.py       # Core tip & bill splitting functions
├── app.py              # Streamlit Web UI & CLI interface
├── tests/              # Unit tests
│   └── test_calculator.py
├── requirements.txt    # Python dependencies
├── .gitignore          # Git ignore file
└── README.md           # Project documentation
```

---

## 📚 What I Learned

- Designing reusable Python calculation functions with type annotations.
- Handling edge-case validations (e.g. division by zero, negative amounts).
- Building simple user interfaces using **Streamlit**.

---

## 📄 License

Distributed under the MIT License.
