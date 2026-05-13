from dataclasses import dataclass
from datetime import date

@dataclass(frozen=True)
class YearMonth:
    year: int
    month: int

    @classmethod
    def from_date(cls, dt: date) -> "YearMonth":
        return cls(year=dt.year, month=dt.month)

    def to_date(self) -> date:
        return date(self.year, self.month, 1)

    def __str__(self) -> str:
        # Returns format used in frontend mock: "Jan/25"
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        short_year = str(self.year)[2:]
        return f"{months[self.month - 1]}/{short_year}"
