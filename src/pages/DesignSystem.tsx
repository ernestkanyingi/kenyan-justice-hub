
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const colorBlocks = [
  { name: "Primary", class: "gov-bg-primary", var: "#1F3B4D" },
  { name: "Secondary", class: "gov-bg-secondary", var: "#3A6C8C" },
  { name: "Background", class: "gov-bg-background", var: "#F7F9FB" },
  { name: "Action", class: "gov-bg-action", var: "#0056b3" },
  { name: "Danger", class: "gov-bg-danger", var: "#D32F2F" },
  { name: "Success", class: "gov-bg-success", var: "#2E7D32" },
];

const DesignSystem = () => (
  <div className="gov-container max-w-3xl mx-auto py-8">
    <h1 className="gov-text-2xl font-bold mb-6">Design System Demo</h1>
    
    {/* Colors */}
    <section className="mb-10">
      <h2 className="gov-text-xl font-semibold mb-3">Color Palette</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {colorBlocks.map((blk) => (
          <div key={blk.name} className={`rounded-lg p-4 ${blk.class} shadow gov-card`}>
            <div className="gov-text-base font-medium mb-1">{blk.name}</div>
            <div className="gov-text-xs">{blk.var}</div>
            <div className="mt-2 text-right">
              <span className={`inline-block w-4 h-4 rounded-full ${blk.class}`} />
            </div>
          </div>
        ))}
      </div>
    </section>
    
    {/* Typography */}
    <section className="mb-10">
      <h2 className="gov-text-xl font-semibold mb-3">Typography Scale</h2>
      <div className="space-y-1">
        <div className="gov-text-xs">Text XS (12px)</div>
        <div className="gov-text-sm">Text SM (14px)</div>
        <div className="gov-text-base">Text BASE (16px)</div>
        <div className="gov-text-lg">Text LG (18px)</div>
        <div className="gov-text-xl">Text XL (20px)</div>
        <div className="gov-text-2xl">Text 2XL (24px)</div>
      </div>
    </section>
    
    {/* Buttons */}
    <section className="mb-10">
      <h2 className="gov-text-xl font-semibold mb-3">Buttons</h2>
      <div className="flex flex-wrap gap-3">
        <Button className="gov-button-primary">Primary</Button>
        <Button className="gov-button-secondary">Secondary</Button>
        <Button className="gov-button-action">Action</Button>
        <Button className="gov-button-danger">Danger</Button>
        <Button className="gov-button-success">Success</Button>
        <Button variant="outline">Outline</Button>
      </div>
    </section>
    
    {/* Badges */}
    <section className="mb-10">
      <h2 className="gov-text-xl font-semibold mb-3">Badges</h2>
      <div className="flex flex-wrap gap-3">
        <Badge className="gov-badge-primary">Primary</Badge>
        <Badge className="gov-badge-secondary">Secondary</Badge>
        <Badge className="gov-badge-success">Success</Badge>
        <Badge className="gov-badge-warning">Warning</Badge>
        <Badge className="gov-badge-danger">Danger</Badge>
      </div>
    </section>
    
    {/* Cards */}
    <section className="mb-10">
      <h2 className="gov-text-xl font-semibold mb-3">Card Example</h2>
      <Card className="gov-card p-5">
        <div className="gov-text-lg font-semibold mb-1">Card Title</div>
        <div className="gov-text-base mb-2">Card body text uses BASE style. This card demonstrates border, radius, and shadow.</div>
        <Button className="gov-button-action">Action</Button>
      </Card>
    </section>
    
    {/* Forms */}
    <section className="mb-10">
      <h2 className="gov-text-xl font-semibold mb-3">Form Inputs</h2>
      <form>
        <div className="gov-form-group">
          <label className="gov-label">Label</label>
          <input className="gov-form-input" type="text" placeholder="Type here..." />
        </div>
        <Button className="gov-button-primary" type="submit">Submit</Button>
      </form>
    </section>
  </div>
);

export default DesignSystem;
