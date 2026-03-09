"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

const remoteness = [
  "Major city",
  "Inner regional",
  "Outer regional / remote",
];

const eteRate = [91.5, 89.6, 86.3];
const notEteRate = eteRate.map((value) => Number((100 - value).toFixed(1)));

const bachelorRate = [44.2, 18.6, 15.6];

const apprenticeshipRate = [12.0, 18.4, 19.5];
const traineeshipRate = [4.5, 7.9, 7.4];

const baseGrid = {
  left: 32,
  right: 24,
  top: 24,
  bottom: 40,
  containLabel: true,
};

const axisLabel = {
  color: "#334155",
  fontSize: 12,
};

const legendTextStyle = {
  color: "#334155",
  fontSize: 12,
};

const tooltip = {
  trigger: "axis",
  axisPointer: { type: "shadow" },
  valueFormatter: (value: number) => `${value}%`,
};

const chartStyle = { height: 320, width: "100%" };

export function EvidenceCharts() {
  const eteOption = {
    aria: { enabled: true },
    grid: baseGrid,
    tooltip,
    legend: {
      textStyle: legendTextStyle,
      bottom: 0,
    },
    xAxis: {
      type: "category",
      data: remoteness,
      axisLabel,
      axisTick: { alignWithLabel: true },
    },
    yAxis: {
      type: "value",
      axisLabel: { ...axisLabel, formatter: "{value}%" },
      max: 100,
      splitLine: { lineStyle: { color: "#e2e8f0" } },
    },
    series: [
      {
        name: "Education, training or employment (ETE)",
        type: "bar",
        stack: "ete",
        data: eteRate,
        color: "#0f4c5c",
        emphasis: { focus: "series" },
      },
      {
        name: "Not in ETE (derived)",
        type: "bar",
        stack: "ete",
        data: notEteRate,
        color: "#cbd5e1",
        emphasis: { focus: "series" },
      },
    ],
  };

  const bachelorOption = {
    aria: { enabled: true },
    grid: baseGrid,
    tooltip,
    xAxis: {
      type: "category",
      data: remoteness,
      axisLabel,
      axisTick: { alignWithLabel: true },
    },
    yAxis: {
      type: "value",
      axisLabel: { ...axisLabel, formatter: "{value}%" },
      max: 60,
      splitLine: { lineStyle: { color: "#e2e8f0" } },
    },
    series: [
      {
        name: "Bachelor degree enrolments",
        type: "bar",
        data: bachelorRate,
        color: "#1d6a7b",
        barMaxWidth: 48,
      },
    ],
  };

  const apprenticeshipOption = {
    aria: { enabled: true },
    grid: baseGrid,
    tooltip,
    legend: {
      textStyle: legendTextStyle,
      bottom: 0,
    },
    xAxis: {
      type: "category",
      data: remoteness,
      axisLabel,
      axisTick: { alignWithLabel: true },
    },
    yAxis: {
      type: "value",
      axisLabel: { ...axisLabel, formatter: "{value}%" },
      max: 25,
      splitLine: { lineStyle: { color: "#e2e8f0" } },
    },
    series: [
      {
        name: "Apprenticeship",
        type: "bar",
        data: apprenticeshipRate,
        color: "#2f7a8f",
        barMaxWidth: 36,
      },
      {
        name: "Traineeship",
        type: "bar",
        data: traineeshipRate,
        color: "#9ab7c2",
        barMaxWidth: 36,
      },
    ],
  };

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Entry Drop-off (All recent school leavers)
        </div>
        <div className="rounded-sm border border-slate-200 bg-white p-4">
          <ReactECharts
            option={eteOption}
            style={chartStyle}
            opts={{ renderer: "svg" }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Bachelor Degree Participation
        </div>
        <div className="rounded-sm border border-slate-200 bg-white p-4">
          <ReactECharts
            option={bachelorOption}
            style={chartStyle}
            opts={{ renderer: "svg" }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Apprenticeship and Traineeship Rates
        </div>
        <div className="rounded-sm border border-slate-200 bg-white p-4">
          <ReactECharts
            option={apprenticeshipOption}
            style={chartStyle}
            opts={{ renderer: "svg" }}
          />
        </div>
      </div>
    </div>
  );
}
