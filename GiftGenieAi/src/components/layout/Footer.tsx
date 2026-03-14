export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-display text-xl font-bold mb-4">GiftGenie <span className="text-primary">AI</span></h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your magical AI gift assistant. We search the entire web to find the most thoughtful, 
              personalized gifts for the people you love.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="/wizard" className="hover:text-primary transition-colors">Start Finding</a></li>
              <li><a href="/saved" className="hover:text-primary transition-colors">My Wishlist</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Magic Delivered</h4>
            <p className="text-sm text-muted-foreground">
              Built with Blink SDK and AI to make gift-giving effortless and delightful.
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} GiftGenie AI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
