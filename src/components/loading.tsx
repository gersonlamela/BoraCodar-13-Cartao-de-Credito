import Image from 'next/image';
import LoadingSpiner from '../assets/loading.svg';

export function Loading() {
	return (
		<div className="w-full flex items-center justify-center animate-spin">
			<Image src={LoadingSpiner} alt="Loading" />
		</div>
	);
}
