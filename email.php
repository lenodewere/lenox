<form
  action="https://formspree.io/f/xkgrljpp"
  method="POST"
  class="contact-form"
  id="contact-form">

  <input
    type="text"
    name="name"
    placeholder="Your Name"
    autocomplete="name"
    required
    class="contact-input">

  <input
    type="email"
    name="email"
    placeholder="Your Email"
    autocomplete="email"
    required
    class="contact-input">

  <textarea
    name="message"
    placeholder="Tell me about your project..."
    required
    class="contact-input"></textarea>

  <!-- Optional subject for the email you receive -->
  <input
    type="hidden"
    name="_subject"
    value="New Project Inquiry - Lenox's Creations">

  <!-- Spam protection -->
  <input
    type="text"
    name="_gotcha"
    style="display:none">

  <button
    type="submit"
    class="btn-submit"
    id="submit-btn">

    Send Message

  </button>

  <p
    id="form-status"
    class="form-status"
    aria-live="polite">
  </p>

</form>