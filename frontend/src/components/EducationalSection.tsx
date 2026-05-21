import type { ReactNode } from 'react'
import { BookOpen } from 'lucide-react'

export function EducationalSection() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
          <BookOpen className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold tracking-normal text-slate-950">Lecture des resultats</h2>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Info title="Recuit simule">
          L'algorithme part d'une configuration aleatoire, puis teste des voisins proches. Il garde les reglages qui ameliorent le score global.
        </Info>
        <Info title="Acceptation controlee">
          Une solution moins bonne peut etre acceptee au debut pour eviter un optimum local. Cette possibilite diminue avec la temperature du recuit.
        </Info>
        <Info title="Front de Pareto">
          Une solution Pareto n'est dominee par aucune autre : on ne peut pas ameliorer un critere sans degrader au moins un autre critere.
        </Info>
        <Info title="Interpretation">
          Le meilleur score reflete vos poids ADMC. Les profils montrent ensuite des compromis utiles selon l'usage : autonomie, silence, froid ou performance.
        </Info>
      </div>
    </section>
  )
}

function Info({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="rounded-lg bg-slate-50 p-4">
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{children}</p>
    </article>
  )
}
