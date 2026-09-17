type StarsProps = {
	level: number;
}

export default function Stars({ level }: StarsProps) {
	const maxStars = 5;
	return (
		<span
			aria-label={`Schwierigkeit ${level} von ${maxStars}`}
			title={`Schwierigkeit ${level} von ${maxStars}`}
		>
			{"●".repeat(level)}
			{"○".repeat(Math.max(0, maxStars - level))}
		</span>
	);
}
