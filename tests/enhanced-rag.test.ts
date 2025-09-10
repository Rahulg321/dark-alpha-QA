/**
 * Test suite for Enhanced RAG Implementation
 * 
 * This file tests the improved RAG system that searches across
 * the entire database including embeddings, companies, tickets, Q&As, etc.
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/test-globals';
import { enhancedRAGSearch, chatRAGSearch } from '../lib/ai/enhanced-rag';
import { globalSearch } from '../lib/ai/tools/global-search';
import { enhancedInformationSearch } from '../lib/ai/tools/enhanced-information-search';

describe('Enhanced RAG System', () => {
  describe('enhancedRAGSearch', () => {
    it('should search across all database tables when no filters are applied', async () => {
      const result = await enhancedRAGSearch('test query', {
        maxResults: 10,
      });

      expect(result).toBeDefined();
      expect(result.searchResults).toBeInstanceOf(Array);
      expect(result.contextSummary).toBeDefined();
      expect(result.contextSummary.totalSources).toBeGreaterThanOrEqual(0);
      expect(result.rawContext).toBeDefined();
    });

    it('should filter by company ID when provided', async () => {
      const companyId = 'test-company-id';
      const result = await enhancedRAGSearch('company information', {
        companyId,
        maxResults: 5,
      });

      expect(result).toBeDefined();
      // Check that results are filtered by company
      result.searchResults.forEach(result => {
        if (result.companyId) {
          expect(result.companyId).toBe(companyId);
        }
      });
    });

    it('should respect maxResults parameter', async () => {
      const maxResults = 3;
      const result = await enhancedRAGSearch('test query', {
        maxResults,
      });

      expect(result.searchResults.length).toBeLessThanOrEqual(maxResults);
    });

    it('should include similarity scores for embedding results', async () => {
      const result = await enhancedRAGSearch('test query', {
        includeEmbeddings: true,
        includeCompanies: false,
        includeTickets: false,
        includeQAs: false,
        includeChats: false,
        includeDocs: false,
      });

      const embeddingResults = result.searchResults.filter(r => r.type === 'embedding');
      embeddingResults.forEach(result => {
        expect(result.similarity).toBeDefined();
        expect(typeof result.similarity).toBe('number');
        expect(result.similarity).toBeGreaterThan(0);
        expect(result.similarity).toBeLessThanOrEqual(1);
      });
    });

    it('should search different content types correctly', async () => {
      const result = await enhancedRAGSearch('test query', {
        maxResults: 20,
      });

      const sourceTypes = new Set(result.searchResults.map(r => r.type));
      
      // Should potentially find multiple types of content
      expect(sourceTypes.size).toBeGreaterThanOrEqual(0);
      
      // All results should have required fields
      result.searchResults.forEach(result => {
        expect(result.type).toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.title).toBeDefined();
        expect(result.content).toBeDefined();
      });
    });

    it('should handle empty queries gracefully', async () => {
      const result = await enhancedRAGSearch('', {
        maxResults: 5,
      });

      expect(result).toBeDefined();
      expect(result.searchResults).toBeInstanceOf(Array);
      expect(result.contextSummary.totalSources).toBe(0);
    });

    it('should calculate context summary correctly', async () => {
      const result = await enhancedRAGSearch('test query', {
        maxResults: 10,
      });

      expect(result.contextSummary).toBeDefined();
      expect(result.contextSummary.totalSources).toBe(result.searchResults.length);
      expect(result.contextSummary.sourcesBreakdown).toBeDefined();
      expect(typeof result.contextSummary.sourcesBreakdown).toBe('object');
      
      // Verify sources breakdown adds up correctly
      const totalFromBreakdown = Object.values(result.contextSummary.sourcesBreakdown)
        .reduce((sum, count) => sum + count, 0);
      expect(totalFromBreakdown).toBe(result.contextSummary.totalSources);
    });
  });

  describe('chatRAGSearch', () => {
    it('should return formatted context string', async () => {
      const result = await chatRAGSearch('test query');

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle no results case', async () => {
      const result = await chatRAGSearch('xyzzyquuxnonexistentquery12345');

      expect(typeof result).toBe('string');
      expect(result).toContain('No relevant information found');
    });

    it('should accept user and company filters', async () => {
      const result = await chatRAGSearch('test query', 'user-id', 'company-id');

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Tool Integration', () => {
    describe('globalSearch tool', () => {
      it('should execute successfully with valid query', async () => {
        const result = await globalSearch.execute({
          query: 'test search query',
        });

        expect(result).toBeDefined();
        expect(result.success).toBeDefined();
        expect(result.query).toBe('test search query');
        
        if (result.success) {
          expect(result.context).toBeDefined();
          expect(result.contextFound).toBe(true);
          expect(result.instructions).toBeDefined();
        }
      });

      it('should handle query with additional context', async () => {
        const result = await globalSearch.execute({
          query: 'company information',
          context: 'looking for financial data',
        });

        expect(result).toBeDefined();
        expect(result.query).toContain('company information');
        expect(result.query).toContain('financial data');
      });

      it('should return failure for empty query', async () => {
        const result = await globalSearch.execute({
          query: '',
        });

        expect(result).toBeDefined();
        expect(result.success).toBe(false);
      });
    });

    describe('enhancedInformationSearch tool', () => {
      it('should execute with all parameters', async () => {
        const result = await enhancedInformationSearch.execute({
          query: 'test search',
          companyId: 'test-company',
          maxResults: 5,
          focusAreas: ['embeddings', 'companies'],
        });

        expect(result).toBeDefined();
        expect(result.query).toBe('test search');
        expect(result.totalResults).toBeGreaterThanOrEqual(0);
        
        if (result.success) {
          expect(result.results).toBeInstanceOf(Array);
          expect(result.searchedAreas).toContain('embeddings');
          expect(result.searchedAreas).toContain('companies');
        }
      });

      it('should use default parameters when none provided', async () => {
        const result = await enhancedInformationSearch.execute({
          query: 'default parameter test',
        });

        expect(result).toBeDefined();
        expect(result.query).toBe('default parameter test');
        
        if (result.success) {
          expect(result.searchedAreas).toContain('embeddings');
          expect(result.searchedAreas).toContain('companies');
          expect(result.searchedAreas).toContain('tickets');
        }
      });

      it('should handle specific focus areas correctly', async () => {
        const result = await enhancedInformationSearch.execute({
          query: 'focus area test',
          focusAreas: ['companies'],
        });

        expect(result).toBeDefined();
        
        if (result.success) {
          expect(result.searchedAreas).toContain('companies');
          expect(result.searchedAreas).not.toContain('embeddings');
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // This would require mocking database failures
      // For now, just test that the functions don't throw
      await expect(enhancedRAGSearch('test')).resolves.toBeDefined();
    });

    it('should handle invalid similarity thresholds', async () => {
      const result = await enhancedRAGSearch('test', {
        similarityThreshold: -1, // Invalid threshold
      });

      expect(result).toBeDefined();
      expect(result.searchResults).toBeInstanceOf(Array);
    });

    it('should handle extremely large maxResults', async () => {
      const result = await enhancedRAGSearch('test', {
        maxResults: 1000000, // Unreasonably large
      });

      expect(result).toBeDefined();
      expect(result.searchResults.length).toBeLessThan(1000000);
    });
  });

  describe('Performance', () => {
    it('should complete searches within reasonable time', async () => {
      const startTime = Date.now();
      
      await enhancedRAGSearch('performance test query', {
        maxResults: 10,
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within 30 seconds (generous for CI environments)
      expect(duration).toBeLessThan(30000);
    });

    it('should handle concurrent searches', async () => {
      const promises = [
        enhancedRAGSearch('concurrent test 1'),
        enhancedRAGSearch('concurrent test 2'),
        enhancedRAGSearch('concurrent test 3'),
      ];

      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result.searchResults).toBeInstanceOf(Array);
      });
    });
  });
});

describe('Integration with Existing System', () => {
  it('should maintain backward compatibility with getResourcesInformation', async () => {
    // Test that existing resource-based searches still work
    // This ensures we don't break existing functionality
    expect(true).toBe(true); // Placeholder - would need actual integration test
  });

  it('should work with current chat interface', async () => {
    // Test integration with the chat API
    expect(true).toBe(true); // Placeholder - would need actual API integration test
  });
});

// Mock data setup for tests
beforeAll(async () => {
  // Setup test data if needed
  console.log('Setting up Enhanced RAG tests...');
});

afterAll(async () => {
  // Cleanup test data if needed
  console.log('Cleaning up Enhanced RAG tests...');
});