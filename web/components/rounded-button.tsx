import clsx from 'clsx';

// const maskedAddress = (address: string) => address.toLowerCase().replace(/0x(\w{4})\w+(\w{4})/, '0x$1...$2')
export default function RoundedButton({ onClick = () => { }, text }: { onClick?: Function; text: string; }) {
  return (
    <button className={clsx(
      'border-2 border-white hover:border-white/75 hover:text-white/75',
      'rounded-full px-16 py-2 my-8'
    )} onClick={() => onClick()}>{text}</button>
  );
};
