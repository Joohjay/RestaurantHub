function About() {
  return (
    <div className="page aboutPage">
      <div className="pageHero">
        <h1>About DineHub</h1>
        <p>
          DineHub makes it easy to discover your favorite restaurants, place orders, reserve tables, and schedule pickups from one simple platform.
        </p>
      </div>

      <div className="aboutGrid">
        <section className="aboutCard">
          <h2>Our Mission</h2>
          <p>
            We help diners save time and enjoy memorable meals by connecting them with trusted restaurants nearby. Our goal is to simplify every step of the dining experience, from browsing menus to collecting food.
          </p>
        </section>

        <section className="aboutCard">
          <h2>What We Offer</h2>
          <ul>
            <li>Easy restaurant discovery with curated menus</li>
            <li>Fast online ordering and secure checkout</li>
            <li>Table reservations and pickup scheduling</li>
            <li>Real-time status tracking for orders and reservations</li>
          </ul>
        </section>

        <section className="aboutCard">
          <h2>Why Choose DineHub</h2>
          <p>
            DineHub combines beautiful design with powerful restaurant tools. Whether you're dining in, picking up, or ordering delivery, we make every interaction smooth and reliable.
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;