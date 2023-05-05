import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import Image from 'next/image';
import visaLogo from '../assets/Visa_logo.svg';
import contact from '../assets/contact.svg';
import Security from '../assets/security.svg';

import * as z from 'zod';

import {zodResolver} from '@hookform/resolvers/zod';
import {Loading} from '@/components/loading';

const creditCardSchema = z.object({
	cardNumber: z.string().regex(/^\d{4} \d{4} \d{4} \d{4}$/, {message: 'Insira um número de cartão válido'}),
	cardName: z.string().min(2, {message: 'Insira um nome de cartão válido'}),
	expirationDate: z
		.string()
		.regex(/([0-9][0-9])\/([0-9]{2})/, 'Invalid expiration date')
		.refine((expirationDate) => {
			const [month, year] = expirationDate.split('/');
			const expirationDate1 = new Date(Number(20 + year), Number(month) - 1, 1);
			const now = new Date();

			return expirationDate1 > now;
		}, 'Expiration date must be in the future.'),
	cvv: z.string().regex(/^\d{3}$/),
});

interface CreditCardFormData {
	cardNumber: string;
	cardName: string;
	expirationDate: string;
	cvv: string;
}

export default function Home() {
	const {
		register,
		handleSubmit,
		formState: {errors},
		reset,
	} = useForm<CreditCardFormData>({
		resolver: zodResolver(creditCardSchema),
	});

	type FormData = z.infer<typeof creditCardSchema>;

	const [formData, setFormData] = useState<FormData>({
		cardNumber: '',
		cardName: '',
		cvv: '',
		expirationDate: '',
	});

	const isFormValid = (data: FormData): boolean => {
		try {
			creditCardSchema.parse(data);
			return true;
		} catch (err) {
			return false;
		}
	};

	const [cardFront, setCardFront] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	function handleCardNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
		let formattedNumber = event.target.value.replace(/[^0-9]/g, ''); // remove any non-digit characters
		formattedNumber = formattedNumber.replace(/(\d{4})/g, '$1 '); // add a space after every fourth digit
		if (formattedNumber.length <= 20) {
			setFormData({
				...formData,
				cardNumber: formattedNumber.trim(),
			});
			// set the state variable with the formatted number, removing any extra spaces
		}
	}

	function handlesetcard() {
		setCardFront(!cardFront);
	}
	function handleExpirationDateChange(event: React.ChangeEvent<HTMLInputElement>) {
		const value = event.target.value;

		// Split the number string into two parts separated by a "/"
		const formattedNumber = value.replace(/^(\d{2})(\d{2})$/, '$1/$2');

		// Update the input value with the formatted number string
		event.target.value = formattedNumber;

		setFormData({
			...formData,
			expirationDate: formattedNumber,
		});
	}

	const onSubmit = (data: CreditCardFormData) => {
		setLoading(true);

		setTimeout(() => {
			setLoading(false), console.log(data);
		}, 3000);
	};

	return (
		<main className={`flex  min-h-screen flex-col items-center justify-center bg-gray-800 md:bg-transparent `}>
			<div className="w-full md:w-[736px] h-auto bg-gray-800 rounded-lg p-8 ">
				<form onSubmit={handleSubmit(onSubmit)} className=" flex items-center justify-between flex-col h-full">
					<div className="w-full   flex  flex-col-reverse md:flex-row  items-center justify-center gap-16 mb-12">
						<div className="md:hidden flex items-center justify-center gap-2 my-8">
							<Image src={Security} alt="Picture of the author" />
							<span className="text-gray-200 text-sm">Seus dados estão seguros</span>
						</div>
						<div className={`max-w-[328px] max-h-full flex flex-col justify-center ${errors.cardNumber ? 'gap-2' : 'gap-6'}  `}>
							<div className="flex flex-col gap-1 ">
								<label htmlFor="cardNumber" className="font-semibold text-sm text-gray-200">
									Número do cartão
								</label>
								<div className="flex flex-col">
									<input id="creditCardInput" type="text" value={formData.cardNumber} {...register('cardNumber')} onChange={handleCardNumberChange} placeholder="**** **** **** ****" className={`w-full h-12 border ${errors.cardNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-700'} bg-gray-900 rounded text-base p-3 text-gray-100 focus:border-purple-600 focus:outline-none`} />

									{errors.cardNumber && <span className="text-red-500 text-sm relative">{errors.cardNumber.message}</span>}
								</div>
							</div>

							<div className="flex flex-col gap-1">
								<label htmlFor="" className="font-semibold text-sm text-gray-200">
									Nome do titular
								</label>
								<div>
									<input
										type="text"
										id=""
										{...register('cardName')}
										placeholder="Nome como está no cartão"
										onChange={(e) =>
											setFormData({
												...formData,
												cardName: e.target.value,
											})
										}
										className={`w-full h-12 border ${errors.cardName ? 'border-red-500 focus:border-red-500' : 'border-gray-700'} bg-gray-900 rounded text-base p-3 text-gray-100 focus:border-purple-600 focus:outline-none `}
									/>
									{errors.cardName && <span className="text-red-500 text-sm">{errors.cardName.message}</span>}
								</div>
							</div>

							<div className="flex flex-row gap-4">
								<div className="flex flex-col gap-1">
									<label htmlFor="" className="font-semibold text-sm text-gray-200">
										Validade
									</label>
									<div>
										<input type="text" id="" maxLength={5} value={formData.expirationDate} {...register('expirationDate')} placeholder="mm/aa" onChange={handleExpirationDateChange} className={`w-full h-12 border ${errors.expirationDate ? 'border-red-500 focus:border-red-500' : 'border-gray-700'} bg-gray-900 rounded text-base p-3 text-gray-100 focus:border-purple-600 focus:outline-none`} />
										{errors.expirationDate && <span className="text-red-500 text-sm">{errors.expirationDate.message}</span>}
									</div>
								</div>

								<div className="flex flex-col gap-1 max-w-[130px]">
									<label htmlFor="" className="font-semibold text-sm text-gray-200">
										CVV
									</label>
									<div>
										<input
											type="text"
											id=""
											{...register('cvv')}
											maxLength={3}
											placeholder="***"
											onChange={(e) =>
												setFormData({
													...formData,
													cvv: e.target.value,
												})
											}
											className={`w-full h-12 border ${errors.cvv ? 'border-red-500 focus:border-red-500' : 'border-gray-700'} bg-gray-900 rounded text-base p-3 text-gray-100 focus:border-purple-600 focus:outline-none`}
										/>
										{errors.cvv && <span className="text-red-500 text-sm">{errors.cvv.message}</span>}
									</div>
								</div>
							</div>
						</div>

						{cardFront === false ? (
							<div className="flex items-center justify-center flex-col gap-8" onClick={handlesetcard}>
								<div className="w-[280px] h-[168px] flex flex-col items-center justify-between  bg-[url('../assets/bg-card-front.png')] p-[25px] rounded-2xl ">
									<div className="flex items-center justify-between w-[250px] ">
										<Image src={visaLogo} alt="Picture of the author" />
										<Image src={contact} alt="Picture of the author" />
									</div>
									<div>
										<div className="w-[250px] relative">
											<span className="text-gray-50 text-base font-semibold">{formData.cardNumber}</span>
										</div>
										<div className="w-[250px]  flex items-center justify-between gap-4 mt-[10px]">
											<input value={formData.cardName} placeholder="Seu nome aqui" className="text-gray-50 truncate text-sm font-semibold  bg-transparent  w-full" />
											<input value={formData.expirationDate} placeholder="* * / * *" className="text-gray-50 text-sm font-semibold w-[57px] bg-transparent text-center" />
										</div>
									</div>
								</div>
								<div className=" hidden md:flex items-center justify-center gap-2">
									<Image src={Security} alt="Picture of the author" />
									<span className="text-gray-200 text-sm">Seus dados estão seguros</span>
								</div>
							</div>
						) : (
							<div className="flex items-center justify-center flex-col gap-8" onClick={handlesetcard}>
								<div className="w-[280px] h-[168px] flex flex-col items-center justify-between  bg-[url('../assets/bg-card-back.png')] bg-cover p-[25px] relative ">
									<div className="absolute top-[98px] bottom-0 left-44 righ-0">
										<input type="text" name="" id="" placeholder="* * *" value={formData.cvv} className="w-10 bg-transparent" />
									</div>
								</div>
								<div className=" hidden md:flex items-center justify-center gap-2">
									<Image src={Security} alt="Picture of the author" />
									<span className="text-gray-200 text-sm">Seus dados estão seguros</span>
								</div>
							</div>
						)}
					</div>

					<button type="submit" className=" w-full h-[56px] bg-[#A855F7] text-gray-50 text-lg  disabled:text-gray-400 disabled:bg-[#9333EA] disabled:bg-opacity-50 disabled:cursor-not-allowed " disabled={!isFormValid(formData)}>
						{loading ? <Loading /> : <span>Adicionar Cartão</span>}
					</button>
				</form>
			</div>
		</main>
	);
}
