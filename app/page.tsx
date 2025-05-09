"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarDays, Users, CreditCard, CheckCircle, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedCard } from "@/components/animated-card"
import { useInView } from "framer-motion"
import { useRef } from "react"

export default function Home() {
  const featuresRef = useRef(null)
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 })

  const eventTypesRef = useRef(null)
  const eventTypesInView = useInView(eventTypesRef, { once: true, amount: 0.2 })

  const ctaRef = useRef(null)
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.5 })

  // Variantes para animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Organize seus eventos com{" "}
              <span className="text-emerald-600 dark:text-emerald-400 relative">
                facilidade
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1 bg-emerald-600 dark:bg-emerald-400"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Planeje festas, churrascos e encontros sem complicação. Divida tarefas, gerencie convidados e organize
              despesas em um só lugar.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                >
                  Começar agora <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Saiba mais
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" ref={featuresRef}>
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0 }}
            animate={featuresInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            Tudo que você precisa para organizar eventos incríveis
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
          >
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mb-4">
                <CalendarDays className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Planejamento simples</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Crie eventos em minutos e gerencie todos os detalhes em um só lugar.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestão de convidados</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Envie convites, acompanhe confirmações e mantenha todos informados.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Divisão de custos</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Organize eventos colaborativos e divida os custos de forma justa e transparente.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Listas e tarefas</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Crie listas de itens, atribua responsáveis e acompanhe o progresso.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Event Types Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900" ref={eventTypesRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={eventTypesInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Para qualquer tipo de evento</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-12">
              Seja uma pequena reunião ou uma grande celebração, o Planeja+ é perfeito para qualquer ocasião.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatedCard delay={0.1} className="h-full">
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
                <div className="h-48 bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=192&width=384"
                    alt="Churrasco"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Churrascos</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Organize churrascos perfeitos dividindo itens e custos entre os convidados.
                  </p>
                  <Link href="/register">
                    <Button variant="outline" className="w-full">
                      Começar a planejar
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.2} className="h-full">
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
                <div className="h-48 bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=192&width=384"
                    alt="Aniversários"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Aniversários</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Planeje festas de aniversário inesquecíveis com todos os detalhes organizados.
                  </p>
                  <Link href="/register">
                    <Button variant="outline" className="w-full">
                      Começar a planejar
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.3} className="h-full">
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
                <div className="h-48 bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=192&width=384"
                    alt="Encontros"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Encontros</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Reúna amigos e familiares com facilidade para momentos especiais.
                  </p>
                  <Link href="/register">
                    <Button variant="outline" className="w-full">
                      Começar a planejar
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600 dark:bg-emerald-800 text-white" ref={ctaRef}>
        <motion.div
          className="container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Comece a planejar hoje mesmo</h2>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
            Junte-se a milhares de pessoas que já estão organizando eventos incríveis com o Planeja+.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-emerald-600 hover:bg-gray-100 dark:hover:bg-gray-200"
            >
              Criar conta gratuita
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-bold text-white mb-4">Planeja+</h2>
              <p className="max-w-xs">Simplifique a organização dos seus eventos e aproveite mais os momentos.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Produto</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/features" className="hover:text-white transition-colors">
                      Funcionalidades
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="hover:text-white transition-colors">
                      Preços
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-white transition-colors">
                      Sobre nós
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Suporte</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/help" className="hover:text-white transition-colors">
                      Central de ajuda
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white transition-colors">
                      Contato
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/terms" className="hover:text-white transition-colors">
                      Termos de uso
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-white transition-colors">
                      Privacidade
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Planeja+. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
