import { SyntheticEvent, useState } from 'react';
import { supabase } from './supabaseClient';

export default function Auth() {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');

	const handleLogin = async (e: SyntheticEvent) => {
		e.preventDefault();

		try {
			setLoading(true);
			const { error } = await supabase.auth.signInWithOtp({ email });
			if (error) throw error;
			alert('Check your email for the login link!');
		} catch (error: any) {
			alert(error.error_description || error.message);
		} finally {
			setLoading(false);
		}
	};

	async function signInWithFacebook() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'facebook',
		});
		console.log(data, error);
	}

	return (
		<div className='row flex-center flex'>
			<div className='col-6 form-widget' aria-live='polite'>
				<h1 className='header'>Hey 👋🚀</h1>
				<p className='description'>Sign in via magic link with your email below</p>
				{loading ? (
					'Sending magic link...'
				) : (
					<form onSubmit={handleLogin}>
						<label htmlFor='email'>Email</label>
						<input
							id='email'
							className='inputField'
							type='email'
							placeholder='Your email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<button type='submit' className='button block' aria-live='polite'>
							Send magic link
						</button>

						<button type='button' onClick={signInWithFacebook} className='button block' aria-live='polite'>
							Sign in with Facebook
						</button>
					</form>
				)}
			</div>
		</div>
	);
}
