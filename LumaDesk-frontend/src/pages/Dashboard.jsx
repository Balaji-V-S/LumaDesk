import React from 'react'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ArrowUpRight } from 'lucide-react'

const Dashboard = () => {
  const { auth } = useAuth()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 py-8"
    >
      {/* Dashboard Header Section - Mimicking the image layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {/* Main Title & Description */}
        <motion.div 
          variants={itemVariants} 
          className="col-span-1 md:col-span-2 space-y-2"
        >
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-xl text-stone-600">
            A friendly minimalist UI for your ticketing overview.
          </p>
          <motion.div variants={itemVariants} className="pt-4">
            <Button variant="accent" size="lg">
              Get started
            </Button>
          </motion.div>
        </motion.div>

        {/* New Users Card - Mimicking the image's statistic card */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-1 lg:col-start-3 self-center">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-5xl font-bold text-foreground">
                  1,024
                </CardTitle>
                <CardDescription className="text-lg mt-1">
                  New users
                </CardDescription>
              </div>
              <span className="p-2 bg-lime-100 rounded-full"> {/* Using direct lime for the icon background */}
                <ArrowUpRight className="h-6 w-6 text-lime-600" />
              </span>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Analytics Chart - Placeholder for the wave chart */}
      <motion.div variants={itemVariants} className="w-full flex justify-center py-8">
        <div className="w-full max-w-4xl h-64 bg-white rounded-2xl shadow-lg border border-stone-200/60 flex items-center justify-center">
          {/* This is a visual placeholder for the chart depicted in the image */}
          <div className="relative w-full h-full p-4">
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-primary/30 to-transparent rounded-b-2xl opacity-70"></div>
            <div className="absolute bottom-4 left-0 right-0 h-2 bg-primary/80 rounded-full mx-8"></div> {/* Represents the peak line */}
            <div className="absolute bottom-0 w-full h-full flex items-end justify-center">
              <span className="text-stone-400 text-sm italic">Analytics Chart Placeholder</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Existing User Info Cards - Relocated for better flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Your Role</CardTitle>
              <CardDescription>Current Access Level</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-primary">
                {auth.role}
              </span>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>User ID</CardTitle>
              <CardDescription>Your unique identifier</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-foreground">
                {auth.userId}
              </span>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants} className="md:col-span-3">
           <Card>
            <CardHeader>
              <CardTitle>Authentication Token</CardTitle>
              <CardDescription>Your active session token (Obfuscated)</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-xs font-mono break-all text-stone-500 blur-[2px] select-none">
                {auth.token}
              </span>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Dashboard