from dataclasses import dataclass
from typing import Optional
from app.domain.value_objects.year_month import YearMonth

@dataclass(frozen=True)
class MonthlySnapshot:
    reference_month: YearMonth
    planejadas: int
    executadas_no_prazo: int
    fora_do_prazo: int
    overdue: int
    exec_antecipadas: int
    mitigacoes: int
    faa: int
    ptci: float
    mci: float
    region_code: Optional[str] = None # None for fleet-wide
