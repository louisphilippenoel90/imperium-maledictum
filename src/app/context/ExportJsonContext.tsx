'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

type ExportJsonContextValue = {
	lastExportObject: unknown | null;
	lastExportJson: string | null;
	dispatchExport: (payload: { exportObject: unknown; exportJson: string }) => void;
};

const ExportJsonContext = createContext<ExportJsonContextValue | null>(null);

export function ExportJsonProvider({ children }: { children: React.ReactNode }) {
	const [lastExportObject, setLastExportObject] = useState<unknown | null>(null);
	const [lastExportJson, setLastExportJson] = useState<string | null>(null);

	const value = useMemo<ExportJsonContextValue>(
		() => ({
			lastExportObject,
			lastExportJson,
			dispatchExport: ({ exportObject, exportJson }) => {
				setLastExportObject(exportObject);
				setLastExportJson(exportJson);
			},
		}),
		[lastExportJson, lastExportObject],
	);

	return <ExportJsonContext.Provider value={value}>{children}</ExportJsonContext.Provider>;
}

export function useExportJson() {
	const ctx = useContext(ExportJsonContext);
	if (!ctx) throw new Error('useExportJson must be used within ExportJsonProvider');
	return ctx;
}

