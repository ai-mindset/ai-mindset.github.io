package main

import (
	"fmt"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		fail(fmt.Errorf("usage: go run . <check|build|serve|dev|verify|links|snapshot>"))
	}

	var err error
	switch os.Args[1] {
	case "check":
		err = auditContent()
	case "build":
		err = buildSite()
	case "serve":
		err = serveSite()
	case "dev":
		if err = buildSite(); err == nil {
			err = serveSite()
		}
	case "verify":
		err = verifySite()
	case "links":
		err = checkExternalLinks()
	case "snapshot":
		err = snapshotCounter()
	default:
		err = fmt.Errorf("unknown command %q", os.Args[1])
	}
	if err != nil {
		fail(err)
	}
}

func fail(err error) {
	fmt.Fprintln(os.Stderr, err)
	os.Exit(1)
}
