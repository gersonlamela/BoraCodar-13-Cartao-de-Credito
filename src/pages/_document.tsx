import {Html, Head, Main, NextScript} from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap" rel="stylesheet" />
			</Head>

			<title>Desafio 13 - Cartão de crédito</title>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
