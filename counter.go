package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
)

const maxSafeInteger = 1<<53 - 1

type visitorSnapshot struct {
	Total       int64   `json:"total"`
	LastUpdated *string `json:"lastUpdated"`
}

func readVisitorSnapshot() (visitorSnapshot, error) {
	data, err := os.ReadFile("counter/visitors.json")
	if err != nil {
		return visitorSnapshot{}, err
	}
	return decodeVisitorSnapshot(data)
}

func decodeVisitorSnapshot(data []byte) (visitorSnapshot, error) {
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return visitorSnapshot{}, err
	}
	if fields["total"] == nil || string(fields["total"]) == "null" || fields["lastUpdated"] == nil {
		return visitorSnapshot{}, fmt.Errorf("visitor snapshot needs total and lastUpdated")
	}
	var snapshot visitorSnapshot
	if err := json.Unmarshal(data, &snapshot); err != nil {
		return visitorSnapshot{}, err
	}
	if err := validateVisitorSnapshot(snapshot); err != nil {
		return visitorSnapshot{}, err
	}
	return snapshot, nil
}

func validateVisitorSnapshot(snapshot visitorSnapshot) error {
	if snapshot.Total < 0 || snapshot.Total > maxSafeInteger {
		return fmt.Errorf("visitor total must be a non-negative safe integer")
	}
	if snapshot.LastUpdated != nil {
		date, err := time.Parse("2006-01-02", *snapshot.LastUpdated)
		if err != nil || date.Format("2006-01-02") != *snapshot.LastUpdated {
			return fmt.Errorf("invalid visitor snapshot date")
		}
	}
	return nil
}

func snapshotCounter() error {
	value := os.Getenv("VISITOR_DOWNLOAD_COUNT")
	if value == "" || strings.Trim(value, "0123456789") != "" {
		return fmt.Errorf("VISITOR_DOWNLOAD_COUNT must be a non-negative integer")
	}
	total, err := strconv.ParseInt(value, 10, 64)
	if err != nil {
		return err
	}
	date := os.Getenv("COUNTER_SNAPSHOT_DATE")
	if date == "" {
		date = time.Now().UTC().Format("2006-01-02")
	}
	snapshot := visitorSnapshot{Total: total, LastUpdated: &date}
	if err := validateVisitorSnapshot(snapshot); err != nil {
		return err
	}
	data, err := json.MarshalIndent(snapshot, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile("counter/visitors.json", append(data, '\n'), 0644)
}

func formatCount(total int64) string {
	digits := strconv.FormatInt(total, 10)
	for i := len(digits) - 3; i > 0; i -= 3 {
		digits = digits[:i] + "," + digits[i:]
	}
	return digits
}
