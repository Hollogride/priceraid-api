import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Keyboard,
  Platform,
} from "react-native";

const API_BASE = "http://10.190.79.199:5000/search";

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    Keyboard.dismiss();
    setLoading(true);
    setError(null);
    setResults([]);
    setSearched(true);

    try {
      const response = await fetch(`${API_BASE}?q=${encodeURIComponent(trimmed)}`);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const json = await response.json();
      setResults(json.data ?? []);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  const renderProduct = ({ item, index }) => (
    <View style={[styles.card, index === 0 && styles.cardFirst]}>
      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
        resizeMode="contain"
        defaultSource={require("./assets/placeholder.png")}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title ?? "—"}
        </Text>
        <View style={styles.productMeta}>
          <Text style={styles.productPrice}>{item.price ?? "N/A"}</Text>
          <View style={styles.storeBadge}>
            <Text style={styles.storeText} numberOfLines={1}>
              {item.store ?? "Unknown"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (loading || !searched) return null;
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyTitle}>No results found</Text>
        <Text style={styles.emptySubtitle}>Try a different search term</Text>
      </View>
    );
  };

  const renderError = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={handleSearch}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PriceCompare</Text>
        <Text style={styles.headerSubtitle}>Find the best deals instantly</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.searchIcon}>🔎</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a product..."
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>
        <TouchableOpacity
          style={[styles.searchButton, !query.trim() && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={!query.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Results Count */}
      {results.length > 0 && !loading && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
            <Text style={styles.resultsQuery}>"{query.trim()}"</Text>
          </Text>
        </View>
      )}

      {/* Content */}
      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Finding best prices...</Text>
        </View>
      ) : error ? (
        renderError()
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => item.link ?? String(index)}
          renderItem={renderProduct}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  // Header
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4F46E5",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 2,
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    paddingVertical: 0,
    ...Platform.select({ android: { paddingVertical: 2 } }),
  },
  searchButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    paddingHorizontal: 20,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  searchButtonDisabled: {
    backgroundColor: "#C7D2FE",
    shadowOpacity: 0,
    elevation: 0,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  // Results header
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultsCount: {
    fontSize: 13,
    color: "#6B7280",
  },
  resultsQuery: {
    fontWeight: "600",
    color: "#374151",
  },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },

  // Card
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginTop: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    alignItems: "center",
  },
  cardFirst: {
    marginTop: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    marginRight: 14,
    flexShrink: 0,
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
    gap: 8,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 20,
  },
  productMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  productPrice: {
    fontSize: 17,
    fontWeight: "700",
    color: "#4F46E5",
  },
  storeBadge: {
    backgroundColor: "#EEF2FF",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    maxWidth: 130,
  },
  storeText: {
    fontSize: 12,
    color: "#6366F1",
    fontWeight: "500",
  },

  // Loading
  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  loadingText: {
    fontSize: 15,
    color: "#6B7280",
  },

  // Empty
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
  },

  // Error
  errorState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: 60,
    gap: 8,
  },
  errorIcon: {
    fontSize: 44,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  errorMessage: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: "#4F46E5",
    borderRadius: 10,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default SearchScreen;