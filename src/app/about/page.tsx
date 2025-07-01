import { Card, CardContent } from "@/components/ui/card"
import { Brain, Users, Zap, Target, Award, Globe } from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: "Smart Quiz Creation",
      description:
        "Our intuitive interface makes it easy to create engaging quizzes with multiple question types, custom settings, and rich media support.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Join thousands of educators, trainers, and quiz enthusiasts who use QuizMaster to create and share knowledge.",
    },
    {
      icon: Zap,
      title: "Instant Analytics",
      description:
        "Get real-time insights into quiz performance, user engagement, and learning outcomes with our comprehensive analytics.",
    },
    {
      icon: Target,
      title: "Customizable Experience",
      description:
        "Tailor quizzes to your specific needs with difficulty levels, time limits, and personalized feedback options.",
    },
    {
      icon: Award,
      title: "Gamification",
      description:
        "Motivate learners with leaderboards, achievements, and interactive elements that make learning fun and engaging.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Share your quizzes worldwide with multi-language support and seamless integration across platforms.",
    },
  ]

  const team = [
    {
      name: "Roshan Raj",
      role: "Founder & CEO & CTO",
      description: "Competitive Programmer who is also a Full-stack developer passionate about creating intuitive and scalable educational platforms.",
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">About QuizMaster</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We&apos;re on a mission to make learning interactive, engaging, and accessible to everyone. QuizMaster empowers
            educators, trainers, and knowledge enthusiasts to create and share meaningful quiz experiences.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-16">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We believe that learning should be interactive, engaging, and fun. Our platform bridges the gap
                  between traditional education and modern technology, providing tools that make knowledge sharing more
                  effective and enjoyable.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Whether you&apos;re a teacher creating assessments, a trainer developing skill evaluations, or someone who
                  loves trivia, QuizMaster provides the tools you need to create meaningful learning experiences.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg p-8 text-center">
                <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">10,000+</h3>
                <p className="text-gray-600 dark:text-gray-300">Quizzes Created</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="feature-icon mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="col-start-2">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <Card>
          <CardContent className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Accessibility First</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  We believe education should be accessible to everyone, regardless of their technical background or
                  physical abilities. Our platform is designed with inclusivity at its core.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Privacy & Security</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your data and your users&apos; data are precious. We implement industry-leading security measures and
                  transparent privacy practices to keep information safe.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Continuous Innovation</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  We&apos;re constantly evolving our platform based on user feedback and emerging educational technologies to
                  provide the best possible experience.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Community Support</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our success is measured by your success. We provide comprehensive support and resources to help you
                  achieve your educational goals.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
