export default function Footer() {
  return (
    <footer
      className="footer sm:footer-horizontal footer-center bg-[#212C31] text-base-content py-[1.5rem] md:px-0 px-[1.5rem]"
      style={{ boxShadow: "0 -2px 6px rgba(0, 0, 0, 0.1)" }}
    >
      <p className="text-base text-white max-w-[80%]">
        ©2025 CoreUp. {new Date().getFullYear()} - All rights reserved. Made
        with love for learners.
      </p>
    </footer>
  );
}
