function Contact() {
  return (
    <div className="page contactPage">
      <div className="pageHero">
        <h1>Contact RestaurantHub</h1>
        <p>
          We’re here to help with orders, reservations, menu questions, or general feedback. Reach out and our support team will reply within one business day.
        </p>
      </div>

      <div className="contactGrid">
        <section className="contactCard">
          <h2>Customer Support</h2>
          <p>Have a question about your order or reservation? Our team is ready to assist.</p>
          <p><strong>Email:</strong> support@restauranthub.com</p>
          <p><strong>Phone:</strong> +255 700 000 000</p>
          <p><strong>Hours:</strong> Mon - Fri, 8am - 8pm</p>
        </section>

        <section className="contactCard">
          <h2>Partner Restaurants</h2>
          <p>Interested in joining the RestaurantHub network? We support flexible onboarding, menu management, and delivery integration.</p>
          <p><strong>Email:</strong> partners@restauranthub.com</p>
          <p><strong>Phone:</strong> +255 700 111 222</p>
        </section>

        <section className="contactCard">
          <h2>Office Location</h2>
          <p>Visit us or send mail to our headquarters in Dar es Salaam.</p>
          <p>123 Food Market Road</p>
          <p>Dar es Salaam, Tanzania</p>
        </section>
      </div>
    </div>
  );
}

export default Contact;