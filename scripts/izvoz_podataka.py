"""Pretvara rezultate iz projekta turizam-hr u JSON za dashboard.

Pokretanje (iz foldera turizam-dashboard):
    python scripts/izvoz_podataka.py ../turizam-hr
"""
import json
import sys
from pathlib import Path

import pandas as pd

izvor = Path(sys.argv[1] if len(sys.argv) > 1 else "../turizam-hr")
cilj = Path(__file__).resolve().parents[1] / "public" / "data"
cilj.mkdir(parents=True, exist_ok=True)

# Mjesečni podaci, samo od 2012. (prije toga Eurostat broji drugačije)
df = pd.read_csv(izvor / "data" / "processed" / "mjesecno.csv", parse_dates=["date"])
df = df[df["date"] >= "2012-01-01"]
mjesecno = [
    {
        "datum": d.strftime("%Y-%m"),
        "godina": int(d.year),
        "mjesec": int(d.month),
        "nocenja": int(n),
        "temp": None if pd.isna(t) else round(float(t), 1),
        "covid": int(c),
        "uskrs": int(u),
        "duhovi": int(du),
    }
    for d, n, t, c, u, du in zip(df["date"], df["nocenja"], df["temp_prosjek"], df["covid"],
                                 df["uskrs_u_mjesecu"], df["duhovi_u_mjesecu"])
]

p = pd.read_csv(izvor / "data" / "processed" / "prognoza.csv", parse_dates=["date"])
prognoza = [
    {"datum": d.strftime("%Y-%m"), "baseline": int(b), "sarima": int(s), "lightgbm": int(l)}
    for d, b, s, l in zip(p["date"], p["baseline"], p["sarima"], p["lightgbm"])
]

m = pd.read_csv(izvor / "reports" / "rezultati_modela.csv", index_col=0)
modeli = [{"model": ime, "mae": int(r["MAE"]), "mape": float(r["MAPE_%"])} for ime, r in m.iterrows()]

for ime, sadrzaj in [("mjesecno", mjesecno), ("prognoza", prognoza), ("modeli", modeli)]:
    (cilj / f"{ime}.json").write_text(json.dumps(sadrzaj, ensure_ascii=False), encoding="utf-8")
    print(f"{ime}.json: {len(sadrzaj)} zapisa")
