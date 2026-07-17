import Image from 'next/image';

const MLSALogo = ({ width = 96, height = 96, className = "w-24 h-24" }) => (
    <Image 
        src="/mlsa-logo.png" 
        alt="MLSA MIET Logo" 
        width={width} 
        height={height} 
        className={className} 
    />
);

export default MLSALogo;