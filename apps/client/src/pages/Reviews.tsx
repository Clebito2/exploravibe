import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import type { Review, Experience } from "@exploravibe/shared";
import { MOCK_EXPERIENCES } from "@/lib/mockData";
import Header from "@/components/Header";
import FlashlightCursor from "@/components/FlashlightCursor";
import Skeleton from "@/components/Skeleton";
import { TRAVELER_TYPES } from "@/lib/constants";

// Mock reviews for demonstration
const MOCK_REVIEWS: Review[] = [
    {
        id: "rev-1",
        experienceId: "jpa-catamara",
        userId: "user-1",
        userName: "Maria Silva",
        rating: 5,
        title: "Experiência inesquecível!",
        comment: "O pôr do sol no rio Paraíba é simplesmente mágico. O guia foi muito atencioso e conhecedor da história local. Recomendo fortemente para casais e famílias.",
        visitDate: "2025-12-15",
        travelerType: "casal",
        helpful: 24,
        createdAt: "2025-12-20T10:30:00Z"
    },
    {
        id: "rev-2",
        experienceId: "jpa-catamara",
        userId: "user-2",
        userName: "Carlos Oliveira",
        rating: 4,
        title: "Muito bom, mas chegou atrasado",
        comment: "A experiência em si foi excelente, mas o barco atrasou 30 minutos. Fora isso, tudo perfeito. As bebidas incluídas são de boa qualidade.",
        visitDate: "2025-12-10",
        travelerType: "amigos",
        helpful: 12,
        createdAt: "2025-12-12T15:45:00Z"
    },
    {
        id: "rev-3",
        experienceId: "goiania-art-deco",
        userId: "user-3",
        userName: "Ana Beatriz",
        rating: 5,
        title: "Tour cultural imperdível!",
        comment: "Aprendi muito sobre a história de Goiânia. O guia é um verdadeiro historiador e contou histórias fascinantes sobre cada prédio. O Teatro Goiânia é lindo!",
        visitDate: "2025-11-28",
        travelerType: "solo",
        helpful: 31,
        createdAt: "2025-12-01T09:00:00Z"
    }
];

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
    const sizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-7 h-7" };
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`${sizes[size]} ${star <= rating ? "text-coral" : "text-ocean/20"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => onChange(star)}
                    className="p-1 transition-transform hover:scale-110 active:scale-95"
                >
                    <svg
                        className={`w-10 h-10 ${star <= (hover || value) ? "text-coral" : "text-ocean/20"} transition-colors`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </button>
            ))}
        </div>
    );
}

export default function Reviews() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [filterRating, setFilterRating] = useState<number | null>(null);

    // Form state
    const [formRating, setFormRating] = useState(5);
    const [formTitle, setFormTitle] = useState("");
    const [formComment, setFormComment] = useState("");
    const [formTravelerType, setFormTravelerType] = useState<Review["travelerType"]>("solo");
    const [formVisitDate, setFormVisitDate] = useState("");

    const experience = MOCK_EXPERIENCES.find((e: Experience) => e.id === id);

    useEffect(() => {
        // Use mock reviews for now (filter by experience ID)
        // const expReviews = MOCK_REVIEWS.filter(r => r.experienceId === id);
        // setReviews(expReviews);
        // setLoading(false);

        // Firestore listener
        if (!id) return;
        const q = query(collection(db, "reviews"), where("experienceId", "==", id), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
            // Merge with mocks if empty for demo
            if (data.length === 0) {
                setReviews(MOCK_REVIEWS.filter(r => r.experienceId === id));
            } else {
                setReviews(data);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            navigate(`/login?redirect=/experiencia/${id}/avaliacoes`);
            return;
        }
        setSubmitting(true);

        try {
            await addDoc(collection(db, "reviews"), {
                experienceId: id,
                userId: user.uid,
                userName: user.displayName,
                userPhoto: user.photoURL || null,
                rating: formRating,
                title: formTitle,
                comment: formComment,
                visitDate: formVisitDate,
                travelerType: formTravelerType,
                helpful: 0,
                createdAt: new Date().toISOString()
            });

            setShowForm(false);
            setFormTitle("");
            setFormComment("");
            setFormRating(5);
        } catch (error) {
            console.error("Erro ao enviar avaliação:", error);
            alert("Erro ao enviar avaliação. Tente novamente.");
        } finally {
            setSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length,
        percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0
    }));

    const filteredReviews = filterRating
        ? reviews.filter(r => r.rating === filterRating)
        : reviews;

    if (!experience) {
        return <div className="p-10 text-center font-primary text-ocean">Experiência não encontrada.</div>;
    }

    return (
        <main className="min-h-screen bg-white pb-24 selection:bg-crystal selection:text-ocean">
            <FlashlightCursor />
            <Header />

            {/* Hero Section */}
            <div className="relative h-64 sm:h-80 overflow-hidden">
                <img
                    src={experience.images[0]}
                    alt={experience.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ocean/90 via-ocean/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 text-white">
                    <button onClick={() => navigate(-1)} className="mb-4 text-sm opacity-70 hover:opacity-100 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Voltar para detalhes
                    </button>
                    <h1 className="text-3xl sm:text-5xl font-secondary italic mb-2">{experience.title}</h1>
                    <p className="text-white/70 font-primary">{experience.location.city}, {experience.location.state}</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
                {/* Rating Summary Card */}
                <div className="bg-white rounded-[3rem] shadow-2xl border border-ocean/5 p-8 sm:p-12 mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Overall Rating */}
                        <div className="text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                                <span className="text-7xl font-black text-ocean">{averageRating.toFixed(1)}</span>
                                <div>
                                    <StarRating rating={Math.round(averageRating)} size="lg" />
                                    <p className="text-ocean/50 text-sm font-bold mt-1">{reviews.length} avaliações</p>
                                </div>
                            </div>
                            <p className="text-ocean/40 text-xs uppercase tracking-widest font-black">Classificação Geral</p>
                        </div>

                        {/* Rating Distribution */}
                        <div className="lg:col-span-2 space-y-3">
                            {ratingDistribution.map(({ star, count, percentage }) => (
                                <button
                                    key={star}
                                    onClick={() => setFilterRating(filterRating === star ? null : star)}
                                    className={`w-full flex items-center gap-4 p-2 rounded-xl transition-colors ${filterRating === star ? "bg-crystal" : "hover:bg-crystal/30"}`}
                                >
                                    <span className="text-sm font-bold text-ocean w-20 text-left flex items-center gap-1">
                                        {star} <svg className="w-4 h-4 text-coral" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    </span>
                                    <div className="flex-grow h-3 bg-ocean/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-coral rounded-full transition-all" style={{ width: `${percentage}%` }} />
                                    </div>
                                    <span className="text-sm font-bold text-ocean/40 w-12 text-right">{count}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Write Review CTA */}
                {!showForm && (
                    <button
                        onClick={() => user ? setShowForm(true) : navigate(`/login?redirect=/experiencia/${id}/avaliacoes`)}
                        className="w-full mb-12 py-6 bg-coral text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-coral/20 hover:shadow-coral/40 transition-all active:scale-[0.99]"
                    >
                        ✍️ Escrever Avaliação
                    </button>
                )}

                {/* Review Form */}
                {showForm && (
                    <form onSubmit={handleSubmit} className="mb-12 bg-crystal/20 rounded-[2.5rem] p-8 sm:p-12 border border-ocean/10 space-y-8">
                        <div className="flex justify-between items-start">
                            <h3 className="text-2xl font-secondary italic text-ocean">Sua Avaliação</h3>
                            <button type="button" onClick={() => setShowForm(false)} className="text-ocean/40 hover:text-ocean">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest mb-4">Sua Nota</label>
                            <StarInput value={formRating} onChange={setFormRating} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest mb-2">Tipo de Viajante</label>
                                <select
                                    value={formTravelerType}
                                    onChange={(e) => setFormTravelerType(e.target.value as Review["travelerType"])}
                                    className="w-full px-6 py-4 rounded-xl bg-white border border-ocean/10 font-primary font-bold text-ocean outline-none focus:ring-4 focus:ring-ocean/5"
                                >
                                    {Object.entries(TRAVELER_TYPES || {}).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest mb-2">Data da Visita</label>
                                <input
                                    type="date"
                                    value={formVisitDate}
                                    onChange={(e) => setFormVisitDate(e.target.value)}
                                    className="w-full px-6 py-4 rounded-xl bg-white border border-ocean/10 font-primary font-bold text-ocean outline-none focus:ring-4 focus:ring-ocean/5"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest mb-2">Título da Avaliação</label>
                            <input
                                type="text"
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                placeholder="Resuma sua experiência em uma frase"
                                className="w-full px-6 py-4 rounded-xl bg-white border border-ocean/10 font-primary font-bold text-ocean placeholder:text-ocean/20 outline-none focus:ring-4 focus:ring-ocean/5"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-ocean/40 uppercase tracking-widest mb-2">Sua Experiência</label>
                            <textarea
                                value={formComment}
                                onChange={(e) => setFormComment(e.target.value)}
                                placeholder="Conte mais sobre sua visita. O que você mais gostou? O que poderia melhorar?"
                                rows={5}
                                className="w-full px-6 py-4 rounded-xl bg-white border border-ocean/10 font-primary font-bold text-ocean placeholder:text-ocean/20 outline-none focus:ring-4 focus:ring-ocean/5 resize-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-5 bg-ocean text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-xl shadow-ocean/10 hover:shadow-ocean/30 transition-all active:scale-[0.99] disabled:opacity-50"
                        >
                            {submitting ? "Enviando..." : "Publicar Avaliação"}
                        </button>
                    </form>
                )}

                {/* Filter indicator */}
                {filterRating && (
                    <div className="mb-6 flex items-center gap-3">
                        <span className="text-ocean/50 text-sm font-bold">Filtrando por {filterRating} estrelas</span>
                        <button onClick={() => setFilterRating(null)} className="text-coral text-sm font-black hover:underline">
                            Limpar filtro
                        </button>
                    </div>
                )}

                {/* Reviews List */}
                <div className="space-y-8">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-3xl p-8 border border-ocean/5 space-y-4">
                                <div className="flex gap-4">
                                    <Skeleton className="w-14 h-14" variant="circle" />
                                    <div className="flex-grow space-y-2">
                                        <Skeleton className="h-4 w-32" variant="text" />
                                        <Skeleton className="h-3 w-24" variant="text" />
                                    </div>
                                </div>
                                <Skeleton className="h-6 w-3/4" variant="text" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        ))
                    ) : filteredReviews.length === 0 ? (
                        <div className="text-center py-16">
                            <span className="text-6xl mb-6 block">📝</span>
                            <h3 className="text-2xl font-secondary italic text-ocean mb-2">Nenhuma avaliação ainda</h3>
                            <p className="text-ocean/50 font-primary">Seja o primeiro a avaliar esta experiência!</p>
                        </div>
                    ) : (
                        filteredReviews.map((review) => (
                            <article key={review.id} className="bg-white rounded-3xl p-8 border border-ocean/5 hover:shadow-lg transition-shadow">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-ocean flex items-center justify-center text-white font-black text-lg">
                                            {review.userPhoto ? (
                                                <img src={review.userPhoto} alt="" className="w-full h-full object-cover rounded-2xl" />
                                            ) : (
                                                review.userName.charAt(0)
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-black text-ocean">{review.userName}</p>
                                            <p className="text-ocean/40 text-xs font-bold">
                                                {new Date(review.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                                            </p>
                                        </div>
                                    </div>
                                    <StarRating rating={review.rating} />
                                </div>

                                {/* Content */}
                                <h4 className="text-xl font-secondary italic text-ocean mb-3">{review.title}</h4>
                                <p className="text-ocean/70 font-primary leading-relaxed mb-6">{review.comment}</p>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-6 border-t border-ocean/5">
                                    <div className="flex items-center gap-4 text-xs">
                                        <span className="px-4 py-2 bg-crystal rounded-full font-black text-ocean/60">
                                            {review.travelerType && TRAVELER_TYPES[review.travelerType] ? TRAVELER_TYPES[review.travelerType] : "Viajante"}
                                        </span>
                                        <span className="text-ocean/40 font-bold">
                                            Visitou em {new Date(review.visitDate).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
                                        </span>
                                    </div>
                                    <button className="flex items-center gap-2 text-ocean/40 hover:text-coral transition-colors text-sm font-bold">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                        </svg>
                                        Útil ({review.helpful})
                                    </button>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
