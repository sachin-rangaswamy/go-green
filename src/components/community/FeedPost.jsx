import { Heart, MessageCircle, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'

export default function FeedPost({ post }) {
  const { state, dispatch } = useApp()
  const liked = state.likedPosts.includes(post.id)

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-white/5">
      <div className="flex items-center gap-2 p-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-lg">
          {post.user.avatar}
        </span>
        <div className="flex-1">
          <p className="text-sm font-bold text-forest dark:text-paper">{post.user.name}</p>
          <p className="text-[11px] text-earth">Level {post.user.level} · {post.timestamp}</p>
        </div>
        <span className="rounded-full bg-accent/12 px-2 py-0.5 text-[10px] font-bold text-forest dark:text-accent">
          🌿 Green Win
        </span>
      </div>

      <div
        className="flex h-48 items-center justify-center text-7xl"
        style={{ background: `linear-gradient(135deg, ${post.gradient[0]}, ${post.gradient[1]})` }}
      >
        {post.emoji}
      </div>

      <div className="p-3">
        <div className="mb-2 flex items-center gap-4">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_LIKE', id: post.id })}
            className="flex items-center gap-1 active:scale-90"
          >
            <Heart
              size={20}
              className={liked ? 'fill-alert text-alert' : 'text-earth'}
            />
            <span className="text-sm font-semibold text-earth">{post.likes + (liked ? 1 : 0)}</span>
          </button>
          <span className="flex items-center gap-1 text-earth">
            <MessageCircle size={20} />
            <span className="text-sm font-semibold">{post.comments}</span>
          </span>
          <span className="flex items-center gap-1 text-forest dark:text-accent">
            <Sparkles size={19} />
            <span className="text-sm font-semibold">{post.reactions} Inspired</span>
          </span>
        </div>
        <p className="text-sm text-forest dark:text-paper">
          <span className="font-bold">{post.user.name}</span> {post.caption}
        </p>
      </div>
    </div>
  )
}
