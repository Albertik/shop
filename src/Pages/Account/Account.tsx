import { useState, useEffect, SyntheticEvent, ChangeEvent } from 'react';
import { supabase } from './supabaseClient';

const Account = ({ session }: any) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [username, setUsername] = useState<string | null>(null);
	const [website, setWebsite] = useState<string | null>(null);
	const [avatar_url, setAvatarUrl] = useState<string | null>(null);

	useEffect(() => {
		getProfile();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	const getProfile = async () => {
		try {
			setLoading(true);
			if (!session) return;
			const { user } = session;

			let { data, error, status } = await supabase.from('profiles').select(`username, website, avatar_url`).eq('id', user.id).single();

			if (error && status !== 406) {
				throw error;
			}

			if (data) {
				setUsername(data.username);
				setWebsite(data.website);
				setAvatarUrl(data.avatar_url);
			}
		} catch (error: any) {
			alert(error.message);
		} finally {
			setLoading(false);
		}
	};

	const updateProfile = async (e: SyntheticEvent) => {
		e.preventDefault();

		try {
			setLoading(true);
			if (!session) return;
			const { user } = session;

			const updates = {
				id: user.id,
				username,
				website,
				avatar_url,
				updated_at: new Date(),
			};

			let { error } = await supabase.from('profiles').upsert(updates);

			if (error) {
				throw error;
			}
		} catch (error: any) {
			alert(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div aria-live='polite'>
			{loading ? (
				'Saving ...'
			) : (
				<form onSubmit={updateProfile} className='form-widget'>
					<div>Email: {session?.user?.email}</div>
					<div>
						<label htmlFor='username'>Name</label>
						<input
							id='username'
							type='text'
							value={username || ''}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor='website'>Website</label>
						<input
							id='website'
							type='url'
							value={website || ''}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setWebsite(e.target.value)}
						/>
					</div>
					<div>
						<button className='button primary block' disabled={loading}>
							Update profile
						</button>
					</div>
				</form>
			)}
			<button type='button' className='button block' onClick={() => supabase.auth.signOut()}>
				Sign Out
			</button>
		</div>
	);
};

export default Account;
