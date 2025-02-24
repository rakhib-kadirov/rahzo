import Breadcrumbs from "@/app/ui/profile/breadcrumbs";
import Form from "@/app/ui/profile/edit-form";
import { fetchProfileById } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
	const params = await props.params
	const id = params.id
	const [profile] = await Promise.all([
		fetchProfileById(id)
	])

	if (!profile) {
		notFound()
	}

	// if (session?.user?.id !== id) {
	// 	return null
	// }

	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: 'Profile', href: `/dashboard/profile/${id}` },
					{
						label: 'Редактирование профиля',
						href: `/dashboard/profile/${id}/edit`,
						active: true
					}
				]}
			/>
			<Form profile={profile} />
		</main>
	)
}