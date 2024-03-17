import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

const Checkout = () => {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const {
    backendData,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp("/api/orders", requestConfig);

  const cartTotal = cartCtx.items.reduce((prev, curr) => {
    return prev + curr.quantity * curr.price;
  }, 0);

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleFinish() {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }

  function handleSubmit(e) {
    e.preventDefault();

    const form = new FormData(e.target);
    const formData = Object.fromEntries(form.entries());

    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: formData,
        },
      })
    );

    if (!response.ok) {
    }
  }

  let actions = (
    <>
      <Button type={"button"} textOnly onClick={handleClose}>
        Close
      </Button>
      <Button>Submit</Button>
    </>
  );

  if (isSending) {
    actions = <span>Sending data....</span>;
  }

  if (backendData && !error) {
    return (
      <Modal open={userProgressCtx.progress === "checkout"} onClose={handleFinish}>
        <h2>Success!</h2>
        <p>Your order was submitted successfully!</p>
        <p>We will get back to you with more details via email within the next few minutes.</p>
        <p className="modal-actions">
          <Button onClick={handleFinish}>Okay</Button>
        </p>
      </Modal>
    );
  }

  return (
    <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>
        <Input label={"Full Name"} type={"text"} id={"name"}></Input>
        <Input label={"Email Address"} type={"email"} id={"email"}></Input>
        <Input label={"Stree"} type={"text"} id={"street"}></Input>
        <div className="control-row">
          <Input label={"Postal Code"} type={"text"} id={"postal-code"}></Input>
          <Input label={"City"} type={"text"} id={"city"}></Input>
        </div>
        {error && <Error title={"Failed to submit order"} message={error}></Error>}
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
};

export default Checkout;
