from dataclasses import dataclass
from typing import List, Optional
from app.domain.value_objects.year_month import YearMonth

@dataclass(frozen=True)
class FpsoMonthlyDetail:
    reference_month: YearMonth
    pct_no_prazo: Optional[float]
    mci: Optional[float] = None
    faai: Optional[float] = None
    realizadas: int = 0
    planejadas: int = 0
    antecipadas: int = 0

@dataclass(frozen=True)
class FpsoUnit:
    code: str
    months: List[FpsoMonthlyDetail]
