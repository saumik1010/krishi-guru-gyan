import { Sprout } from "lucide-react";
import logo from "@/assets/krishi-shastra-logo.png";

const Header = () => {
  return (
    <header className="bg-gradient-growth text-primary-foreground shadow-medium">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="Krishi Shastra Logo" 
              className="w-12 h-12 animate-float"
            />
            <div>
              <h1 className="text-2xl font-bold">Krishi Shastra</h1>
              <p className="text-primary-foreground/80 text-sm">Agricultural Intelligence</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;