import { Link } from 'react-router-dom';
import logo from '../../assets/cashwise-logo.svg';

interface ILogoProps {
  className?: string; // Optional className
}

export function Logo({ className = '' }: ILogoProps) {
  return (
    <Link to="/">
      <div className={`${className} h-[73px] w-[200px] pl-4 pt-6`}>
        <img src={logo} alt="Cashwise Logo" className="object-contain" />
      </div>
    </Link>
  );
}
