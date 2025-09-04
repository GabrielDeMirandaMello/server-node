const e = React.createElement;

function App() {
  const [customer, setCustomer] = React.useState("");
  const [items, setItems] = React.useState("");
  const [total, setTotal] = React.useState("");
  const [orders, setOrders] = React.useState([]);
  const [editId, setEditId] = React.useState(null);

  React.useEffect(() => fetchOrders(), []);

  async function fetchOrders() {
    const res = await fetch("/api/orders");
    setOrders(await res.json());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!customer || !items || !total) return;

    if (editId) {
      await fetch(`/api/orders/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, items, total: parseFloat(total) }),
      });
      setEditId(null);
    } else {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, items, total: parseFloat(total) }),
      });
    }

    setCustomer("");
    setItems("");
    setTotal("");
    fetchOrders();
  }

  function handleEdit(order) {
    setCustomer(order.customer);
    setItems(order.items);
    setTotal(order.total);
    setEditId(order.id);
  }

  async function handleDelete(id) {
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    fetchOrders();
  }

  const containerStyle = {
    maxWidth: 600,
    margin: "2rem auto",
    padding: "1.5rem",
    backgroundColor: "#fff",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
  };

  const inputStyle = {
    padding: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "0.25rem",
    marginBottom: "0.5rem"
  };

  const buttonStyle = {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "0.25rem",
    cursor: "pointer",
    color: "#fff"
  };

  const submitButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#2563eb"
  };

  const editButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#16a34a"
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#dc2626"
  };

  return e("div", { style: containerStyle },
    e("h1", { style: { fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" } }, "📦 Cadastro de Pedidos"),
    e("form", { onSubmit: handleSubmit, style: { display: "grid" } },
      e("input", { style: inputStyle, placeholder: "Cliente", value: customer, onChange: e => setCustomer(e.target.value) }),
      e("input", { style: inputStyle, placeholder: "Itens", value: items, onChange: e => setItems(e.target.value) }),
      e("input", { style: inputStyle, type: "number", step: "0.01", placeholder: "Total R$", value: total, onChange: e => setTotal(e.target.value) }),
      e("button", { type: "submit", style: submitButtonStyle }, editId ? "Atualizar" : "Cadastrar")
    ),
    e("h2", { style: { fontSize: "1.25rem", fontWeight: "bold", marginTop: "2rem", marginBottom: "0.5rem" } }, "📋 Pedidos"),
    e("ul", { style: { listStyle: "none", padding: 0 } },
      orders.map(o => e("li", { key: o.id, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem", marginBottom: "0.5rem", backgroundColor: "#f9fafb", borderRadius: "0.25rem" } },
        e("span", null, `${o.customer} - ${o.items} - R$ ${o.total}`),
        e("div", { style: { display: "flex", gap: "0.5rem" } },
          e("button", { style: editButtonStyle, onClick: () => handleEdit(o) }, "Editar"),
          e("button", { style: deleteButtonStyle, onClick: () => handleDelete(o.id) }, "Deletar")
        )
      ))
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(e(App));
