import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Banco em memória
let orders = [];
let currentId = 1;

// --- CRUD da API ---

// Listar todos os pedidos
app.get("/api/orders", (req, res) => res.json(orders));

// Criar pedido
app.post("/api/orders", (req, res) => {
  const { customer, items, total } = req.body;
  if (!customer || !items || !total) return res.status(400).json({ error: "Campos obrigatórios" });
  const order = { id: currentId++, customer, items, total };
  orders.push(order);
  res.status(201).json(order);
});

// Atualizar pedido
app.put("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const { customer, items, total } = req.body;
  const order = orders.find(o => o.id === parseInt(id));
  if (!order) return res.status(404).json({ error: "Pedido não encontrado" });

  if (customer) order.customer = customer;
  if (items) order.items = items;
  if (total) order.total = total;

  res.json(order);
});

// Deletar pedido
app.delete("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const index = orders.findIndex(o => o.id === parseInt(id));
  if (index === -1) return res.status(404).json({ error: "Pedido não encontrado" });
  const deleted = orders.splice(index, 1);
  res.json(deleted[0]);
});

// --- Servir front ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.resolve(__dirname, "../client");

app.use(express.static(clientPath));

// Catch-all para SPA
app.get("*", (req, res) => res.sendFile(path.join(clientPath, "index.html")));

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));
