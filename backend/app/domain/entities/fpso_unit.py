from dataclasses import dataclass
from typing import List, Optional
from app.domain.value_objects.year_month import YearMonth

@dataclass(frozen=True)
class FpsoMonthlyDetail:
    reference_month: YearMonth
    pct_no_prazo: Optional[float]
    realizadas: int
    planejadas: int
    antecipadas: int

@dataclass(frozen=True)
class FpsoUnit:
    code: str
    months: List[FpsoMonthlyDetail]
