import React, { useMemo, useState } from "react";
import { useEmotion } from "../contexts/EmotionContext";

const initialPosts = () => ([
	{
		id: 1,
		title: "Support during stressful times",
		content: "How do you cope with anxiety?",
		author: `User${Math.floor(Math.random() * 9000 + 1000)}`,
		replies: []
	}
]);

const Forum = () => {
	const { currentTheme } = useEmotion();
	const [posts, setPosts] = useState(initialPosts);
	const [isComposerOpen, setIsComposerOpen] = useState(false);
	const [newTitle, setNewTitle] = useState("");
	const [newContent, setNewContent] = useState("");
	const [postAsAnonymous, setPostAsAnonymous] = useState(false);
	const coinBadge = useMemo(() => ({ label: "MaCoin", value: 0 }), []);

	const createAnonId = () => `User${Math.floor(Math.random() * 9000 + 1000)}`;

	const handleCreatePost = () => {
		const title = newTitle.trim();
		const content = newContent.trim();
		if (!title || !content) return;
		const newPost = {
			id: Date.now(),
			title,
			content,
			author: postAsAnonymous ? "Anonymous" : createAnonId(),
			replies: []
		};
		setPosts(prev => [newPost, ...prev]);
		setIsComposerOpen(false);
		setNewTitle("");
		setNewContent("");
		setPostAsAnonymous(false);
	};

	const handleSubmitReply = (postId, replyText) => {
		const text = replyText.trim();
		if (!text) return;
		setPosts(prev => prev.map(p => p.id === postId
			? { ...p, replies: [...p.replies, { author: createAnonId(), content: text, id: Date.now() }] }
			: p
		));
	};

	return (
		<div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
			<div style={{
				background: currentTheme.colors.gradient,
				borderRadius: 20,
				padding: "1.2rem",
				marginBottom: "1rem",
				color: "#fff",
				boxShadow: currentTheme.colors.shadow
			}}>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
					<div>
						<h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 700 }}>WomenLine Discussions</h1>
						<p style={{ margin: 0, opacity: 0.9 }}>A safe and supportive space for meaningful discussions</p>
					</div>
					<div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
						<div style={{ background: "#ffe066", color: currentTheme.colors.primary, borderRadius: 9999, padding: ".25rem .6rem", fontWeight: 700, fontSize: ".85rem" }}>🪙 {coinBadge.value} {coinBadge.label}</div>
						<button
							onClick={() => setIsComposerOpen(true)}
							style={{
								background: "#fff",
								color: currentTheme.colors.primary,
								border: "1px solid rgba(255,255,255,0.35)",
								padding: ".6rem 1rem",
								borderRadius: 10,
								fontWeight: 600,
								cursor: "pointer"
							}}
						>
							+ New Discussion
						</button>
					</div>
				</div>
			</div>

			<div style={{ display: "grid", gap: "1rem" }}>
				{posts.map(post => (
					<ForumPostCard key={post.id} post={post} theme={currentTheme} onReply={handleSubmitReply} />
				))}
			</div>

			{isComposerOpen && (
				<div style={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: "rgba(0,0,0,0.45)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 1000,
					padding: "1rem"
				}}>
					<div style={{
						background: "#fff",
						borderRadius: 16,
						boxShadow: currentTheme.colors.shadow,
						border: `2px solid ${currentTheme.colors.border}`,
						width: "100%",
						maxWidth: 640,
						padding: "1rem",
						position: "relative"
					}}>
						<button
							onClick={() => setIsComposerOpen(false)}
							style={{ position: "absolute", top: 10, right: 12, background: "transparent", border: "none", fontSize: 20, cursor: "pointer", color: currentTheme.colors.text }}
						>
							×
						</button>
						<h2 style={{ margin: 0, marginBottom: ".8rem", color: currentTheme.colors.primary, fontSize: "1.2rem" }}>Start a Discussion</h2>
						<input
							type="text"
							value={newTitle}
							onChange={e => setNewTitle(e.target.value)}
							placeholder="Discussion Title"
							style={{ width: "100%", padding: ".75rem 1rem", borderRadius: 10, border: `2px solid ${currentTheme.colors.border}`, fontSize: ".95rem", marginBottom: ".7rem" }}
						/>
						<textarea
							value={newContent}
							onChange={e => setNewContent(e.target.value)}
							placeholder="Write your message..."
							rows={5}
							style={{ width: "100%", padding: ".75rem 1rem", borderRadius: 10, border: `2px solid ${currentTheme.colors.border}`, fontSize: ".95rem", marginBottom: ".7rem", resize: "vertical" }}
						/>
						<label style={{ display: "flex", alignItems: "center", gap: ".4rem", color: currentTheme.colors.text, opacity: 0.8, fontSize: ".9rem" }}>
							<input type="checkbox" checked={postAsAnonymous} onChange={e => setPostAsAnonymous(e.target.checked)} /> Post as Anonymous
						</label>
						<button
							onClick={handleCreatePost}
							style={{
								marginTop: ".9rem",
								background: currentTheme.colors.primary,
								color: "#fff",
								border: "none",
								padding: ".7rem 1.2rem",
								borderRadius: 10,
								fontWeight: 600,
								cursor: "pointer"
							}}
						>
							Post
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

const ForumPostCard = ({ post, theme, onReply }) => {
	const [isReplyOpen, setIsReplyOpen] = useState(false);
	const [replyText, setReplyText] = useState("");

	return (
		<div style={{
			background: theme.colors.card,
			borderRadius: 16,
			padding: "1rem",
			border: `2px solid ${theme.colors.border}`,
			boxShadow: theme.colors.shadow
		}}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".3rem" }}>
				<span style={{ fontSize: ".75rem", color: "#2e7d32", fontWeight: 600 }}>Checked by AI</span>
				<button onClick={() => alert("Thanks for reporting. Our team will review this.")}
					style={{ background: "transparent", color: "#b71c1c", border: "none", cursor: "pointer", fontSize: ".8rem" }}>
					Report
				</button>
			</div>
			<h3 style={{ color: theme.colors.primary, margin: 0 }}>{post.title}</h3>
			<p style={{ margin: 0, marginTop: 4, fontSize: ".9rem", color: theme.colors.text, opacity: 0.8 }}>Posted by {post.author}</p>
			<p style={{ marginTop: ".7rem", lineHeight: 1.6 }}>{post.content}</p>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: ".7rem", fontSize: ".9rem" }}>
				<button onClick={() => setIsReplyOpen(prev => !prev)}
					style={{ background: "transparent", color: theme.colors.primary, border: "none", cursor: "pointer", fontWeight: 600 }}>
					Reply
				</button>
				<span>{post.replies.length} Replies</span>
			</div>
			{isReplyOpen && (
				<div style={{ marginTop: ".6rem" }}>
					<input
						type="text"
						value={replyText}
						onChange={e => setReplyText(e.target.value)}
						placeholder="Write your reply..."
						style={{ width: "100%", padding: ".6rem .9rem", borderRadius: 10, border: `2px solid ${theme.colors.border}`, fontSize: ".9rem", marginBottom: ".5rem" }}
					/>
					<button
						onClick={() => { onReply(post.id, replyText); setReplyText(""); setIsReplyOpen(false); }}
						style={{ background: theme.colors.primary, color: "#fff", border: "none", padding: ".6rem .9rem", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}
					>
						Post Reply
					</button>
				</div>
			)}
			{post.replies.length > 0 && (
				<div style={{ marginTop: ".8rem", display: "grid", gap: ".4rem" }}>
					{post.replies.map((r) => (
						<div key={r.id} style={{ borderLeft: `4px solid ${theme.colors.border}`, paddingLeft: ".6rem", fontSize: ".9rem" }}>
							<strong style={{ color: theme.colors.primary }}>{r.author}:</strong> {r.content}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Forum;
