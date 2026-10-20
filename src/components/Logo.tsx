import Image from 'next/image';

interface LogoProps {
  variant?: 'complet' | 'marque';
  color?: 'blanc' | 'orange' | 'noir';
  size?: number;
  className?: string;
}

export default function Logo({
  variant = 'complet',
  color = 'blanc',
  size = 200,
  className = '',
}: LogoProps) {
  const getImagePath = () => {
    const variantMap = {
      complet: 'logo',
      marque: 'marque',
    };
    const colorMap = {
      blanc: 'blanc',
      orange: 'orange',
      noir: 'noir',
    };
    return `/logo/${variantMap[variant]}-${colorMap[color]}.png`;
  };

  return (
    <Image
      src={getImagePath()}
      alt="Avenue Café"
      width={size}
      height={size * (variant === 'complet' ? 0.5 : 0.3)}
      className={className}
      priority
    />
  );
}
