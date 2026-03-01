import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Inter'
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
    borderBottom: '2 solid #667eea',
    paddingBottom: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: '#4a5568',
    marginBottom: 5
  },
  section: {
    marginBottom: 25
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 10,
    backgroundColor: '#f7fafc',
    padding: 8,
    borderRadius: 4
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center'
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4a5568',
    width: 120
  },
  value: {
    fontSize: 12,
    color: '#2d3748',
    flex: 1
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  statBox: {
    width: '30%',
    backgroundColor: '#f7fafc',
    padding: 15,
    borderRadius: 8,
    textAlign: 'center'
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 5
  },
  statLabel: {
    fontSize: 10,
    color: '#4a5568'
  },
  performanceTable: {
    marginTop: 10
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#667eea',
    padding: 8,
    marginBottom: 5
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center'
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1 solid #e2e8f0'
  },
  tableCell: {
    fontSize: 10,
    color: '#2d3748',
    flex: 1,
    textAlign: 'center'
  },
  activityList: {
    marginTop: 10
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 5,
    padding: 5
  },
  activityType: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#667eea',
    width: 80
  },
  activityTitle: {
    fontSize: 10,
    color: '#2d3748',
    flex: 1
  },
  activityScore: {
    fontSize: 10,
    color: '#38a169',
    width: 60,
    textAlign: 'right'
  },
  recommendations: {
    marginTop: 20,
    backgroundColor: '#f0fff4',
    padding: 15,
    borderRadius: 8
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#22543d',
    marginBottom: 10
  },
  recommendationItem: {
    fontSize: 10,
    color: '#22543d',
    marginBottom: 5,
    paddingLeft: 10
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#718096',
    borderTop: '1 solid #e2e8f0',
    paddingTop: 15
  }
});

const StudyReportPDF = ({ userData, userStats }) => {
  const strongAreas = userStats?.subjectPerformance ? 
    Object.entries(userStats.subjectPerformance)
      .filter(([_, data]) => data.percentage >= 80)
      .map(([subject, _]) => subject) : [];

  const weakAreas = userStats?.subjectPerformance ? 
    Object.entries(userStats.subjectPerformance)
      .filter(([_, data]) => data.percentage < 70)
      .map(([subject, _]) => subject) : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>EduMentor AI Study Report</Text>
          <Text style={styles.subtitle}>Personalized Learning Analysis</Text>
          <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</Text>
        </View>

        {/* Student Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{userData?.name || 'Demo User'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{userData?.email || 'demo@example.com'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Report Date:</Text>
            <Text style={styles.value}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Performance Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userStats?.stats.totalQuizzes || 0}</Text>
              <Text style={styles.statLabel}>Total Quizzes</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userStats?.stats.averageScore || 0}%</Text>
              <Text style={styles.statLabel}>Average Score</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userStats?.stats.totalStudyPlans || 0}</Text>
              <Text style={styles.statLabel}>Study Plans</Text>
            </View>
          </View>
        </View>

        {/* Subject Performance */}
        {userStats?.subjectPerformance && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subject Performance</Text>
            <View style={styles.performanceTable}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Subject</Text>
                <Text style={styles.tableHeaderText}>Score (%)</Text>
                <Text style={styles.tableHeaderText}>Quizzes</Text>
              </View>
              {Object.entries(userStats.subjectPerformance).map(([subject, data]) => (
                <View key={subject} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{subject}</Text>
                  <Text style={styles.tableCell}>{data.percentage}%</Text>
                  <Text style={styles.tableCell}>{data.quizzes}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recent Activity */}
        {userStats?.recentActivity && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityList}>
              {userStats.recentActivity.slice(0, 5).map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <Text style={styles.activityType}>
                    {activity.type === 'quiz' ? 'Quiz' : 'Study Plan'}
                  </Text>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityScore}>
                    {activity.type === 'quiz' ? `${activity.score}%` : `${activity.progress}%`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recommendations */}
        <View style={styles.recommendations}>
          <Text style={styles.recommendationTitle}>Learning Recommendations</Text>
          {strongAreas.length > 0 && (
            <Text style={styles.recommendationItem}>
              • Strong areas: {strongAreas.join(', ')} - Continue building on these strengths
            </Text>
          )}
          {weakAreas.length > 0 && (
            <Text style={styles.recommendationItem}>
              • Focus areas: {weakAreas.join(', ')} - Dedicate more time to these subjects
            </Text>
          )}
          <Text style={styles.recommendationItem}>
            • Aim for 85%+ average score across all subjects
          </Text>
          <Text style={styles.recommendationItem}>
            • Complete at least 2 study plans per week
          </Text>
          <Text style={styles.recommendationItem}>
            • Take regular quizzes to track progress
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by EduMentor AI - Your AI-Powered Learning Companion</Text>
          <Text>For more information, visit your dashboard at EduMentor AI</Text>
        </View>
      </Page>
    </Document>
  );
};

export default StudyReportPDF; 