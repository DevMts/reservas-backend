## 📖 **Regras de Negócio**

* [x] Cada usuário pode ser **hóspede** e/ou **anfitrião**.
* [ ] Um imóvel só pode ser reservado em **datas disponíveis**.
* [ ] Uma reserva só é confirmada após **pagamento aprovado**.
* [ ] Anfitriões podem definir **preço por noite**, **mínimo de diárias** e **política de cancelamento**.
* [ ] Reservas devem impedir **conflitos de datas** para o mesmo imóvel.
* [ ] Somente hóspedes que concluíram a estadia podem deixar uma **avaliação**.
* [ ] Anfitriões não podem reservar seus próprios imóveis.
* [ ] Cancelamentos devem seguir as regras definidas pelo anfitrião.
* [ ] Cada anúncio deve ter pelo menos **1 foto válida**.

---

## ⚙️ **Requisitos Funcionais**

* [x] **Cadastro/Login de usuário** (email/senha e OAuth).
* [x] **Gerenciamento de perfil** (nome, foto, dados de contato).
* [x] **Cadastro de imóvel** (título, descrição, localização, preço, fotos).
* [ ] **Listagem de imóveis disponíveis** com busca e filtros.
* [ ] **Página de detalhes do imóvel** com fotos, calendário e botão de reserva.
* [ ] **Sistema de reservas** com seleção de datas e cálculo automático do valor total.
* [ ] **Integração de pagamento** (Stripe, Mercado Pago etc.).
* [ ] **Gerenciamento de reservas** (criar, visualizar, cancelar).
* [ ] **Histórico de reservas** do hóspede.
* [ ] **Dashboard do anfitrião** com lista de imóveis e reservas recebidas.
* [ ] **Sistema de avaliações** (nota + comentário).
* [ ] **Envio de email automático** para confirmação/cancelamento de reservas.
* [ ] **Sistema de mensagens entre hóspede e anfitrião** (opcional, avançado).

---

## 🛠️ **Requisitos Não Funcionais**

* [ ] **Autenticação segura** com JWT/OAuth (NextAuth).
* [ ] **Respeitar LGPD** (armazenar apenas dados necessários).
* [ ] **UI responsiva** (desktop, tablet, mobile).
* [ ] **Disponibilidade 24/7** com deploy em nuvem (Vercel/Render/Railway).
* [ ] **Banco de dados relacional** otimizado (PostgreSQL + Prisma).
* [ ] **Sistema escalável** (suporte a múltiplos usuários simultâneos).
* [ ] **Upload seguro de imagens** (Cloudinary/Firebase Storage).
* [ ] **Logs e monitoramento** para falhas (Sentry/LogRocket opcional).
* [ ] **Desempenho otimizado** (lazy loading de imagens, cache de consultas).
* [ ] **Testes automatizados** (unitários e integração, opcional).
* [ ] **Documentação da API** (Swagger ou Postman).
