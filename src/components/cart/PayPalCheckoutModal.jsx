import { useEffect, useRef, useState } from "react";
import { Lock, X, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { useStore } from "../../lib/store";

export default function PayPalCheckoutModal({
  isOpen,
  onClose,
  orderData,
  onSuccess,
  onError
}) {
  const { getPayPalClientId, createPayPalOrder, capturePayPalOrder, format } = useStore();

  const [loadingSdk, setLoadingSdk] = useState(true);
  const [sdkError, setSdkError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [clientId, setClientId] = useState(null);

  const buttonContainerRef = useRef(null);
  const buttonsInstanceRef = useRef(null);

  // 1. Fetch Client ID
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) {
        setLoadingSdk(true);
        setSdkError("");
        setPaymentError("");
      }
    });

    getPayPalClientId()
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.clientId) {
          setClientId(res.clientId);
        } else {
          setSdkError(res.error || "Could not retrieve PayPal configuration.");
          setLoadingSdk(false);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setSdkError(err.message || "Failed to reach payment service.");
        setLoadingSdk(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, getPayPalClientId]);

  // 2. Load PayPal Script & Render Buttons
  useEffect(() => {
    if (!isOpen || !clientId || !buttonContainerRef.current) return;

    let isMounted = true;
    const currency = (orderData?.currency || "USD").toUpperCase();

    const renderButtons = (paypal) => {
      if (!isMounted || !buttonContainerRef.current) return;

      // Clean existing buttons
      if (buttonContainerRef.current) {
        buttonContainerRef.current.innerHTML = "";
      }

      try {
        const buttons = paypal.Buttons({
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
            height: 48
          },
          createOrder: async () => {
            if (!isMounted) return;
            setPaymentError("");
            try {
              const res = await createPayPalOrder({
                amount: orderData.total,
                currency,
                description: `Gemora Diam Studio - ${orderData.items?.length || 1} fine jewelry item(s)`
              });

              if (!res.success || !res.id) {
                throw new Error(res.error || "Failed to initiate PayPal transaction");
              }

              return res.id;
            } catch (err) {
              setPaymentError(err.message || "Could not initialize PayPal order.");
              throw err;
            }
          },
          onApprove: async (data) => {
            if (!isMounted) return;
            setIsCapturing(true);
            setPaymentError("");

            try {
              const res = await capturePayPalOrder({
                paypalOrderId: data.orderID,
                orderData: {
                  items: orderData.items,
                  shippingaddress: orderData.shippingaddress || orderData.shippingAddress,
                  subtotal: orderData.subtotal,
                  total: orderData.total,
                  currencydetails: orderData.currencydetails,
                  currency
                }
              });

              if (!res.success || !res.order) {
                throw new Error(res.error || "Payment was captured but order verification failed.");
              }

              onSuccess(res.order);
            } catch (err) {
              const errMsg = err.message || "PayPal payment capture failed. No order was created.";
              setPaymentError(errMsg);
              if (onError) onError(errMsg);
            } finally {
              if (isMounted) {
                setIsCapturing(false);
              }
            }
          },
          onCancel: () => {
            if (!isMounted) return;
            setIsCapturing(false);
            setPaymentError("PayPal payment was cancelled. Your account was not charged and no order was created.");
          },
          onError: (err) => {
            if (!isMounted) return;
            setIsCapturing(false);
            console.error("PayPal Button error:", err);
            setPaymentError("An error occurred during the PayPal checkout process. Please try again.");
          }
        });

        buttonsInstanceRef.current = buttons;

        if (buttons.isEligible()) {
          buttons.render(buttonContainerRef.current).then(() => {
            if (isMounted) setLoadingSdk(false);
          });
        } else {
          setSdkError("PayPal is currently not available for this currency or region.");
          setLoadingSdk(false);
        }
      } catch (err) {
        console.error("Failed to render PayPal Buttons:", err);
        setSdkError("Could not display PayPal checkout buttons. Please refresh and try again.");
        setLoadingSdk(false);
      }
    };

    // Load SDK script tag
    const scriptId = "paypal-sdk-script";
    const existingScript = document.getElementById(scriptId);

    if (window.paypal && window.paypal.Buttons) {
      renderButtons(window.paypal);
      return;
    }

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (window.paypal) renderButtons(window.paypal);
      });
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&intent=capture&components=buttons`;
    script.async = true;

    script.onload = () => {
      if (window.paypal) {
        renderButtons(window.paypal);
      } else {
        setSdkError("PayPal SDK loaded but is unavailable.");
        setLoadingSdk(false);
      }
    };

    script.onerror = () => {
      setSdkError("Failed to load PayPal secure payment SDK. Check your network connection.");
      setLoadingSdk(false);
    };

    document.body.appendChild(script);

    const container = buttonContainerRef.current;
    return () => {
      isMounted = false;
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [isOpen, clientId, orderData, createPayPalOrder, capturePayPalOrder, onSuccess, onError]);

  if (!isOpen) return null;

  const addr = orderData?.shippingaddress || orderData?.shippingAddress;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(10, 15, 8, 0.7)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.25s ease-out"
      }}
      onClick={(e) => {
        if (!isCapturing && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "#ffffff",
          borderRadius: "6px",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
          border: "1px solid #EAE4D7"
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px 18px",
            borderBottom: "1px solid #F0ECE1",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#FAF9F6"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "var(--primary-soft)",
                color: "var(--primary)",
                display: "grid",
                placeItems: "center"
              }}
            >
              <Lock size={18} />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.25rem",
                  margin: 0,
                  color: "var(--foreground)",
                  fontWeight: 500
                }}
              >
                Secure PayPal Checkout
              </h3>
              <p style={{ margin: "2px 0 0 0", fontSize: "0.74rem", color: "var(--muted-foreground)" }}>
                Encrypted & Insured Payment Gateway
              </p>
            </div>
          </div>

          {!isCapturing && (
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                color: "var(--muted-foreground)",
                borderRadius: "4px",
                display: "flex"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
              title="Close"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "24px 28px" }}>
          {/* Order Summary Snapshot */}
          <div
            style={{
              backgroundColor: "#FAF9F6",
              borderRadius: "4px",
              border: "1px solid #EAE4D7",
              padding: "16px 18px",
              marginBottom: "20px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", fontWeight: 500 }}>
                Total Order Amount
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  color: "var(--primary)"
                }}
              >
                {format ? format(orderData?.total || 0) : `$${Number(orderData?.total || 0).toFixed(2)}`}
              </span>
            </div>

            {addr && (
              <div
                style={{
                  borderTop: "1px dashed #DED7C8",
                  paddingTop: "10px",
                  fontSize: "0.78rem",
                  color: "var(--muted-foreground)",
                  lineHeight: 1.45
                }}
              >
                <strong style={{ color: "var(--foreground)" }}>Shipping to: </strong>
                {addr.address}, {addr.cityname || addr.city}, {addr.statename || addr.state}{" "}
                {addr.pincode && `· ${addr.pincode}`}
              </div>
            )}
          </div>

          {/* Payment Notice */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.76rem",
              color: "var(--muted-foreground)",
              marginBottom: "18px"
            }}
          >
            <ShieldCheck size={16} style={{ color: "var(--primary)", flexShrink: 0 }} />
            <span>
              Your order is created in our database <strong>only after</strong> PayPal confirms successful payment.
            </span>
          </div>

          {/* Error Message if any */}
          {(paymentError || sdkError) && (
            <div
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #F87171",
                borderRadius: "4px",
                padding: "12px 14px",
                marginBottom: "18px",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                color: "#991B1B",
                fontSize: "0.8rem",
                lineHeight: 1.45
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>{paymentError || sdkError}</div>
            </div>
          )}

          {/* Capturing In-Progress State */}
          {isCapturing && (
            <div
              style={{
                textAlign: "center",
                padding: "32px 16px",
                backgroundColor: "#FAF9F6",
                borderRadius: "4px",
                border: "1px solid var(--primary-soft)"
              }}
            >
              <Loader2
                size={34}
                style={{
                  color: "var(--primary)",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 14px auto",
                  display: "block"
                }}
              />
              <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--foreground)" }}>
                Verifying PayPal Payment...
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", marginTop: "6px" }}>
                Please do not close or refresh this page. We are securely capturing your transaction and placing your
                order.
              </p>
            </div>
          )}

          {/* PayPal Buttons Container */}
          <div style={{ display: isCapturing ? "none" : "block" }}>
            {loadingSdk && (
              <div
                style={{
                  textAlign: "center",
                  padding: "36px 0",
                  color: "var(--muted-foreground)",
                  fontSize: "0.84rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                <Loader2 size={24} style={{ animation: "spin 1s linear infinite", color: "var(--primary)" }} />
                <span>Connecting to PayPal Secure Services...</span>
              </div>
            )}

            <div ref={buttonContainerRef} id="paypal-button-container" style={{ minHeight: "100px" }} />
          </div>

          {/* Cancel button */}
          {!isCapturing && (
            <button
              onClick={onClose}
              style={{
                width: "100%",
                marginTop: "16px",
                padding: "10px",
                background: "transparent",
                border: "1px solid #DED7C8",
                borderRadius: "4px",
                color: "var(--muted-foreground)",
                fontSize: "0.78rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--foreground)";
                e.currentTarget.style.color = "var(--foreground)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#DED7C8";
                e.currentTarget.style.color = "var(--muted-foreground)";
              }}
            >
              Cancel & Return to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}