import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import ShareMenu from 'react-native-share-menu';
import { toneAnalyzerAPI } from '../services/api';
import type { MessageType, Relationship, AnalysisResult } from '../types';

export default function AnalyzerScreen() {
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('sms');
  const [relationship, setRelationship] = useState<Relationship>('friend');
  const [additionalContext, setAdditionalContext] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle shared text from other apps
  useEffect(() => {
    ShareMenu.getInitialShare((share) => {
      if (share && share.data) {
        setMessageText(share.data);
      }
    });

    const listener = ShareMenu.addNewShareListener((share) => {
      if (share && share.data) {
        setMessageText(share.data);
      }
    });

    return () => {
      if (listener && typeof listener.remove === 'function') {
        listener.remove();
      }
    };
  }, []);

  const handleAnalyze = async () => {
    if (!messageText.trim()) {
      Alert.alert('Error', 'Please enter a message to analyze');
      return;
    }

    setLoading(true);
    try {
      const result = await toneAnalyzerAPI.analyzeTone({
        messageText,
        messageType,
        relationship,
        additionalContext: additionalContext.trim() || undefined,
      });
      setAnalysisResult(result);
    } catch (error) {
      Alert.alert(
        'Analysis Failed',
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = (responseText: string) => {
    Clipboard.setString(responseText);
    Alert.alert('Copied!', 'Response copied to clipboard');
  };

  const getColorStyles = (colorCode: string) => {
    switch (colorCode) {
      case 'green':
        return { bg: '#d4edda', border: '#28a745', text: '#155724' };
      case 'yellow':
        return { bg: '#fff3cd', border: '#ffc107', text: '#856404' };
      case 'red':
        return { bg: '#f8d7da', border: '#dc3545', text: '#721c24' };
      default:
        return { bg: '#e9ecef', border: '#6c757d', text: '#495057' };
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Message Tone Analyzer</Text>
        <Text style={styles.subtitle}>
          Paste your message and get instant tone analysis
        </Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.label}>Message Text</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Paste the message here..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Message Type</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setMessageType('sms')}>
            <View
              style={[
                styles.radioCircle,
                messageType === 'sms' && styles.radioCircleSelected,
              ]}
            />
            <Text style={styles.radioLabel}>SMS / Text Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setMessageType('email')}>
            <View
              style={[
                styles.radioCircle,
                messageType === 'email' && styles.radioCircleSelected,
              ]}
            />
            <Text style={styles.radioLabel}>Email</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Relationship</Text>
        <View style={styles.radioGroup}>
          {(['friend', 'coworker', 'other'] as Relationship[]).map((rel) => (
            <TouchableOpacity
              key={rel}
              style={styles.radioButton}
              onPress={() => setRelationship(rel)}>
              <View
                style={[
                  styles.radioCircle,
                  relationship === rel && styles.radioCircleSelected,
                ]}
              />
              <Text style={styles.radioLabel}>
                {rel.charAt(0).toUpperCase() + rel.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Additional Context (Optional)</Text>
        <TextInput
          style={styles.textAreaSmall}
          placeholder="Any relevant conversation history or context..."
          value={additionalContext}
          onChangeText={setAdditionalContext}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.analyzeButton, loading && styles.analyzeButtonDisabled]}
          onPress={handleAnalyze}
          disabled={loading || !messageText.trim()}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.analyzeButtonText}>Analyze Tone</Text>
          )}
        </TouchableOpacity>
      </View>

      {analysisResult && (
        <View style={styles.resultsSection}>
          <View
            style={[
              styles.analysisCard,
              {
                backgroundColor: getColorStyles(analysisResult.colorCode).bg,
                borderColor: getColorStyles(analysisResult.colorCode).border,
              },
            ]}>
            <Text
              style={[
                styles.sentimentTitle,
                { color: getColorStyles(analysisResult.colorCode).text },
              ]}>
              {analysisResult.sentiment.charAt(0).toUpperCase() +
                analysisResult.sentiment.slice(1)}{' '}
              Tone
            </Text>
            <Text style={styles.analysisText}>{analysisResult.toneAnalysis}</Text>

            {analysisResult.impliedMeanings.length > 0 && (
              <View style={styles.impliedSection}>
                <Text style={styles.impliedTitle}>Implied Meanings:</Text>
                {analysisResult.impliedMeanings.map((meaning, idx) => (
                  <Text key={idx} style={styles.impliedItem}>
                    • {meaning}
                  </Text>
                ))}
              </View>
            )}
          </View>

          <View style={styles.responsesCard}>
            <Text style={styles.responsesTitle}>Suggested Responses</Text>
            {Object.entries(analysisResult.suggestedResponses).map(
              ([type, response]) => (
                <View key={type} style={styles.responseItem}>
                  <View style={styles.responseHeader}>
                    <Text style={styles.responseType}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                    <TouchableOpacity
                      style={styles.copyButton}
                      onPress={() => handleCopyResponse(response)}>
                      <Text style={styles.copyButtonText}>Copy</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.responseText}>{response}</Text>
                </View>
              )
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#4a90e2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#e3f2fd',
  },
  inputSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    backgroundColor: '#fff',
  },
  textAreaSmall: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    backgroundColor: '#fff',
  },
  radioGroup: {
    marginBottom: 8,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4a90e2',
    marginRight: 10,
  },
  radioCircleSelected: {
    backgroundColor: '#4a90e2',
    borderWidth: 5,
    borderColor: '#4a90e2',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  analyzeButton: {
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#a0c4e8',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsSection: {
    padding: 16,
  },
  analysisCard: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sentimentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  analysisText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  impliedSection: {
    marginTop: 16,
  },
  impliedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  impliedItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    lineHeight: 20,
  },
  responsesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  responsesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  responseItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  responseType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  copyButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  responseText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});
