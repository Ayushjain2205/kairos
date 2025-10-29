export default function Footer() {
  return (
    <footer className="border-t-4 border-gray-800 bg-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <p className="font-bold">© 2025 Kairos. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors font-medium">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors font-medium">Terms</a>
            <a href="#" className="hover:text-primary transition-colors font-medium">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
