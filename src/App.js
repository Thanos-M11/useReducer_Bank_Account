import { useReducer } from "react";

const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
  btnTransAmounts: [
    { id: 0, amount: 20, isSelected: false },
    { id: 1, amount: 40, isSelected: false },
    { id: 2, amount: 50, isSelected: false },
    { id: 3, amount: 60, isSelected: false },
    { id: 4, amount: 80, isSelected: false },
    { id: 5, amount: 100, isSelected: false },
    { id: 6, amount: 200, isSelected: false },
    { id: 7, amount: 400, isSelected: false },
    { id: 8, amount: 500, isSelected: false },
    { id: 9, amount: 600, isSelected: false },
  ],
  otherAmountBtn: false,
  transAmount: 0,
};

function reducer(state, action) {
  if (!state.isActive && action.type !== "openAccount") return state;
  switch (action.type) {
    case "openAccount":
      return { ...state, isActive: true, balance: 500 };

    case "setSelectedBtnTransAmount":
      return {
        ...state,
        btnTransAmounts: state.btnTransAmounts.map((btn) =>
          btn.id === action.payload
            ? { ...btn, isSelected: true }
            : { ...btn, isSelected: false }
        ),
        otherAmountBtn: false,
      };

    case "setTransAmountFromBtn":
      return {
        ...state,
        transAmount: state.btnTransAmounts.at(action.payload).amount,
        otherAmountBtn: false,
      };

    case "setTransAmountFromIput":
      return {
        ...state,
        transAmount: action.payload,
      };

    case "setOtherAmountBtn":
      return {
        ...state,
        otherAmountBtn: true,
        btnTransAmounts: state.btnTransAmounts.map((btn) => {
          return { ...btn, isSelected: false };
        }),
        transAmount: 0,
      };

    case "deposit":
      return {
        ...state,
        balance: state.balance + state.transAmount,
        transAmount: 0,
        btnTransAmounts: state.btnTransAmounts.map((btn) => {
          return { ...btn, isSelected: false };
        }),
        otherAmountBtn: false,
      };

    case "withdraw":
      return {
        ...state,
        balance:
          state.balance < state.transAmount
            ? state.balance
            : state.balance - state.transAmount,
        transAmount: 0,
        btnTransAmounts: state.btnTransAmounts.map((btn) => {
          return { ...btn, isSelected: false };
        }),
        otherAmountBtn: false,
      };
    case "requestLoan":
      if (state.loan === 0)
        return {
          ...state,
          loan: action.payload,
          balance: state.balance + action.payload,
          btnTransAmounts: state.btnTransAmounts.map((btn) => {
            return { ...btn, isSelected: false };
          }),
          otherAmountBtn: false,
        };
      return {
        ...state,
      };

    case "payLoan":
      if (state.transAmount > state.loan) return state;
      return {
        ...state,
        loan: state.loan > 0 ? state.loan - state.transAmount : state.loan,
        balance: state.balance - state.transAmount,
        transAmount: 0,
        btnTransAmounts: state.btnTransAmounts.map((btn) => {
          return { ...btn, isSelected: false };
        }),
        otherAmountBtn: false,
      };
    case "closeAccount":
      if (state.balance === 0 && state.loan === 0) return initialState;
      return { ...state };

    default:
      throw new Error("Uknown action");
  }
}

export default function App() {
  const [
    { balance, loan, isActive, transAmount, btnTransAmounts, otherAmountBtn },
    dispatch,
  ] = useReducer(reducer, initialState);

  return (
    <div className="App">
      <h1>useReducer Bank Account</h1>
      <p>Balance: {balance}</p>
      <p>Loan: {loan}</p>

      <p>
        <button
          onClick={() => dispatch({ type: "openAccount" })}
          disabled={isActive}
        >
          Open account
        </button>
      </p>
      {isActive && (
        <AmountsGroup btnTransAmounts={btnTransAmounts} dispatch={dispatch} />
      )}

      {isActive && (
        <p>
          <button
            className={`btn ${otherAmountBtn && "active"}`}
            onClick={() => dispatch({ type: "setOtherAmountBtn" })}
          >
            Other amount
          </button>
        </p>
      )}
      {otherAmountBtn && (
        <p>
          <input
            type="number"
            placeholder="Enter amount"
            value={transAmount || ""}
            onChange={(e) =>
              dispatch({
                type: "setTransAmountFromIput",
                payload: Number(e.target.value),
              })
            }
          />
        </p>
      )}
      <p>
        {isActive && transAmount !== 0 && (
          <button onClick={() => dispatch({ type: "deposit" })}>Deposit</button>
        )}
      </p>
      <p>
        {isActive && transAmount !== 0 && transAmount <= balance && (
          <button onClick={() => dispatch({ type: "withdraw" })}>
            Withdraw
          </button>
        )}
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: "requestLoan", payload: 5000 })}
          disabled={!isActive || loan > 0}
        >
          Request a loan of 5000
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: "payLoan" })}
          disabled={
            !isActive || !loan > 0 || transAmount === 0 || transAmount > loan
          }
        >
          Pay against loan
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: "closeAccount" })}
          disabled={!isActive || loan !== 0 || balance !== 0}
        >
          Close account
        </button>
      </p>
    </div>
  );
}

function AmountsGroup({ dispatch, btnTransAmounts }) {
  return (
    <section>
      <h4>Choose amount for action</h4>
      <p className="amount-btns">
        {btnTransAmounts.map((btn, index) => (
          <AmountButton
            btnAmount={btn.amount}
            dispatch={dispatch}
            key={btn.amount}
            index={index}
            isSelected={btn.isSelected}
          />
        ))}
      </p>
    </section>
  );
}

function AmountButton({ btnAmount, dispatch, index, isSelected }) {
  function handleBtnTransAmount() {
    dispatch({ type: "setSelectedBtnTransAmount", payload: index });
    dispatch({ type: "setTransAmountFromBtn", payload: index });
  }

  return (
    <button
      className={`btn ${isSelected && "active"}`}
      onClick={handleBtnTransAmount}
    >
      {btnAmount} &euro;
    </button>
  );
}
