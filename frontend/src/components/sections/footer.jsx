export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-[#212C31] text-base-content p-4">
      <aside>
        <p>
         ©2025 CoreUp. {new Date().getFullYear()} - All rights reserved. Made with love for learners.
        </p>
      </aside>
    </footer>
  );
}