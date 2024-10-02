import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">AIMarketer</h3>
            <p className="text-sm">Revolutionizing marketing with AI</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-purple-400 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-purple-400 transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-purple-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Connect</h4>
            <div className="flex space-x-4">
              {/* Add social media icons here */}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p>&copy; {new Date().getFullYear()} AIMarketer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}