function StaticInfoPage({ title, text }) {
  return (
    <main className="page page-top">
      <section className="container">
        <div className="card">
          <h1 className="title">{title}</h1>
          <p className="muted">{text}</p>
        </div>
      </section>
    </main>
  );
}

export default StaticInfoPage;
