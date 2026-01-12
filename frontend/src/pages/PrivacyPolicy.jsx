import "./PrivacyPolicy.css";

export default function PrivacyPolicy() {
  return (
    <div className="privacy-page">
      {/* HERO */}
      <section className="privacy-hero">
        <div className="privacy-hero-content">
          <h1>Privacy Policy</h1>
          <p>Your trust matters to us</p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="privacy-content">
        <div className="privacy-card">
          <h2>Introduction</h2>
          <p>
            At Kashmir Gift Store, we value your privacy and are committed to
            protecting your personal information. This Privacy Policy explains
            how we collect, use, and safeguard your data.
          </p>

          <h2>Information We Collect</h2>
          <ul>
            <li>Personal details such as name, email, phone number</li>
            <li>Shipping and billing information</li>
            <li>Usage data to improve our website experience</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>
            Your information is used to process orders, improve our services,
            communicate updates, and provide a secure shopping experience.
          </p>

          <h2>Data Protection</h2>
          <p>
            We implement strict security measures to ensure your data is safe
            and protected against unauthorized access.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            We do not sell or share your personal data with third parties except
            where required for order fulfillment or legal obligations.
          </p>

          <h2>Your Rights</h2>
          <p>
            You have the right to access, update, or request deletion of your
            personal information at any time.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions regarding our Privacy Policy, feel free to
            contact us at <strong>support@kashmirgiftstore.com</strong>.
          </p>
        </div>
      </section>
    </div>
  );
}
